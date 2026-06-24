const ext = globalThis.browser ?? globalThis.chrome;

const exportButton = document.querySelector("#export-button");
const statusElement = document.querySelector("#status");
const progressSection = document.querySelector("#progress-section");
const progressLabel = document.querySelector("#progress-label");
const progressCount = document.querySelector("#progress-count");
const progressBar = document.querySelector("#progress-bar");
const currentTest = document.querySelector("#current-test");

let activeJobId = null;

function setStatus(message, type = "") {
  statusElement.textContent = message;
  statusElement.className = `status ${type}`.trim();
}

function selectedScope() {
  return document.querySelector('input[name="scope"]:checked')?.value ?? "all";
}

function updateProgress({ phase, completed = 0, total = 0, test = "" }) {
  progressSection.hidden = false;
  const safeTotal = Number.isFinite(total) ? total : 0;
  const safeCompleted = Number.isFinite(completed) ? completed : 0;
  const percent = safeTotal > 0 ? Math.min(100, Math.round((safeCompleted / safeTotal) * 100)) : 0;

  progressBar.style.width = `${percent}%`;
  progressCount.textContent = `${safeCompleted} / ${safeTotal}`;
  currentTest.textContent = test || "—";

  if (phase === "start") progressLabel.textContent = "Préparation de l’export…";
  if (phase === "running") progressLabel.textContent = "Export en cours…";
  if (phase === "complete") progressLabel.textContent = "Export terminé";
  if (phase === "error") progressLabel.textContent = "Export interrompu";
}

function safeFilenamePart(value) {
  return (value || "test-results")
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "test-results";
}

function downloadJson(data) {
  const date = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${safeFilenamePart(data.fileLabel)}-${date}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return filename;
}

function onRuntimeMessage(message) {
  if (message?.channel !== "test-results-exporter" || message?.jobId !== activeJobId) return;
  updateProgress(message);
}

ext.runtime.onMessage.addListener(onRuntimeMessage);

async function exportCurrentPage() {
  exportButton.disabled = true;
  activeJobId = crypto.randomUUID();
  setStatus("Lecture de la page de résultats visible…");
  updateProgress({ phase: "start", completed: 0, total: 0 });

  try {
    const [tab] = await ext.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("Aucun onglet actif n’a été trouvé.");

    const scope = selectedScope();
    const injection = await ext.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractVisibleTests,
      args: [{ onlyFailed: scope === "failed", jobId: activeJobId }]
    });

    const result = injection?.[0]?.result;
    if (!result?.ok) throw new Error(result?.error || "La page de tests n’a pas pu être lue.");

    const filename = downloadJson(result.data);
    const summary = result.data.summary;

    updateProgress({
      phase: "complete",
      completed: summary.exportedTests,
      total: summary.exportedTests,
      test: "Fichier JSON téléchargé"
    });
    setStatus(
      `Fichier enregistré : ${filename}. ${summary.exportedTests} test(s) exporté(s), dont ${summary.failedTests} échec(s).`,
      "success"
    );
  } catch (error) {
    console.error(error);
    updateProgress({ phase: "error" });
    setStatus(
      `Échec de l’export : ${error?.message || "erreur inconnue"}. Ouvre une page de résultats compatible puis réessaie.`,
      "error"
    );
  } finally {
    exportButton.disabled = false;
    activeJobId = null;
  }
}

exportButton.addEventListener("click", exportCurrentPage);

/**
 * Executed in the active tab. Every helper stays inside this function because
 * injected functions cannot access popup variables.
 */
async function extractVisibleTests(options = {}) {
  const config = {
    onlyFailed: Boolean(options.onlyFailed),
    jobId: options.jobId || "",
    minimumWaitAfterClickMs: 450,
    quietWindowMs: 350,
    pollingIntervalMs: 100,
    loadTimeoutMs: 6500
  };

  const extensionApi = globalThis.browser ?? globalThis.chrome;
  const notify = (payload) => {
    try {
      extensionApi?.runtime?.sendMessage({
        channel: "test-results-exporter",
        jobId: config.jobId,
        ...payload
      });
    } catch {
      // Progress is cosmetic. The export can still complete without it.
    }
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const clean = (text = "") => String(text).replace(/\s+/g, " ").trim();

  const directText = (element) =>
    clean(
      [...element.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent || "")
        .join(" ")
    );

  const getStatus = (element) => {
    const colors = [...element.querySelectorAll("svg path[fill]")]
      .map((path) => path.getAttribute("fill")?.toLowerCase());

    if (colors.includes("#a93e10")) return "failed";
    if (colors.includes("#61be28")) return "passed";
    return "unknown";
  };

  const readFailures = () =>
    [...document.querySelectorAll(".trace-failure")].map((failure, index) => ({
      index,
      label: clean(failure.querySelector(".trace-failure__message")?.innerText || `Failure #${index}`),
      diff: failure.querySelector(".trace-failure__text")?.innerText?.trim() || failure.innerText.trim()
    }));

  const waitForActiveTest = async (targetId) => {
    const startedAt = Date.now();
    while (Date.now() - startedAt < config.loadTimeoutMs) {
      if (document.querySelector("#test-list .test__item--active")?.id === targetId) return true;
      await sleep(50);
    }
    return false;
  };

  const waitForRenderToSettle = async () => {
    await sleep(config.minimumWaitAfterClickMs);

    let previousSignature = "";
    let lastChangeAt = Date.now();
    const startedAt = Date.now();

    while (Date.now() - startedAt < config.loadTimeoutMs) {
      const signature = JSON.stringify(readFailures());
      if (signature !== previousSignature) {
        previousSignature = signature;
        lastChangeAt = Date.now();
      }

      if (Date.now() - lastChangeAt >= config.quietWindowMs) return readFailures();
      await sleep(config.pollingIntervalMs);
    }

    return readFailures();
  };

  const list = document.querySelector("#test-list");
  if (!list) {
    return {
      ok: false,
      error: "La liste #test-list est introuvable. Cette page ne semble pas être une page de résultats compatible."
    };
  }

  const categoryById = new Map(
    [...list.querySelectorAll(".test__category__name")].map((element) => [element.id, directText(element)])
  );

  const getCategoryPath = (testId) => {
    const parts = testId.replace("test--", "").split("-");
    const path = [];

    for (let length = 1; length < parts.length; length += 1) {
      const categoryId = `category--${parts.slice(0, length).join("-")}`;
      const categoryName = categoryById.get(categoryId);
      if (categoryName) path.push(categoryName);
    }

    return path;
  };

  const allTests = [...list.querySelectorAll(".test__item__name")]
    .map((element) => ({
      id: element.id,
      name: directText(element),
      status: getStatus(element),
      categoryPath: getCategoryPath(element.id)
    }))
    .filter((test) => test.id && test.name);

  if (allTests.length === 0) {
    return { ok: false, error: "Aucun test n’a été trouvé dans #test-list." };
  }

  const testsToExport = config.onlyFailed
    ? allTests.filter((test) => test.status === "failed")
    : allTests;

  const results = [];
  notify({ phase: "start", completed: 0, total: testsToExport.length, test: "Analyse de la liste…" });

  for (let index = 0; index < testsToExport.length; index += 1) {
    const test = testsToExport[index];
    const testElement = document.getElementById(test.id);
    const displayName = [...test.categoryPath, test.name].join(" / ");

    notify({ phase: "running", completed: index, total: testsToExport.length, test: displayName });

    if (!testElement) {
      results.push({
        ...test,
        loaded: false,
        failures: [],
        warning: "Le test a disparu de la page avant son ouverture.",
        capturedAt: new Date().toISOString()
      });
      notify({ phase: "running", completed: index + 1, total: testsToExport.length, test: displayName });
      continue;
    }

    testElement.scrollIntoView({ block: "center", behavior: "instant" });
    testElement.click();

    const loaded = await waitForActiveTest(test.id);
    const failures = await waitForRenderToSettle();

    results.push({
      ...test,
      loaded,
      failures,
      capturedAt: new Date().toISOString()
    });

    notify({ phase: "running", completed: index + 1, total: testsToExport.length, test: displayName });
  }

  const countByStatus = (status) => allTests.filter((test) => test.status === status).length;
  const data = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    fileLabel: "test-results-export",
    exportScope: config.onlyFailed ? "failed" : "all",
    summary: {
      totalTestsInSidebar: allTests.length,
      exportedTests: results.length,
      passedTests: countByStatus("passed"),
      failedTests: countByStatus("failed"),
      unknownStatusTests: countByStatus("unknown")
    },
    results
  };

  notify({ phase: "complete", completed: results.length, total: results.length, test: "Export prêt" });
  return { ok: true, data };
}
