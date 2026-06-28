# Test Results Exporter

> Export visible test results from compatible pages to a local JSON file.

**Test Results Exporter** is a lightweight Manifest V3 browser extension for saving test results that are already displayed in the active browser tab. It is designed for pages that expose a list of tests, their visible status, and—when applicable—visible failure details.

The extension runs only after you start an export. It processes content rendered in the current tab and downloads a JSON file locally.

## Features

- Export test names and category paths
- Capture visible statuses: `passed`, `failed`, or `unknown`
- Include visible failure messages and diffs when available
- Show live progress while tests are being processed
- Export all tests or failed tests only
- Download results as a local JSON file

## Privacy

Test Results Exporter is built to work locally.

- No account required
- No analytics or advertising
- No remote server or external data transfer
- No network traffic inspection
- No access to browsing history, passwords, or other tabs
- No attempt to retrieve content that is not already rendered by the page

The extension uses the `activeTab` and `scripting` permissions only after an explicit user action.

Read the full [Privacy Policy](docs/PRIVACY_POLICY.md).

## Installation

### Firefox

The extension is available [here](https://addons.mozilla.org/fr/firefox/addon/test-results-exporter/).


For local testing:

1. Open `about:debugging#/runtime/this-firefox`.
2. Select **Load Temporary Add-on**.
3. Choose `manifest.json` from the project folder.

### Chromium-based desktop browsers

The extension can be loaded manually from source on Chromium-based desktop browsers, including **Chrome, Chromium, Brave, Opera, Opera GX, Vivaldi, and Microsoft Edge**.

1. Download or clone this repository, then extract it if necessary.
2. Open your browser's extension management page:

   | Browser | Extensions page |
   | --- | --- |
   | Chrome / Chromium | `chrome://extensions` |
   | Brave | `brave://extensions` |
   | Opera / Opera GX | `opera://extensions` |
   | Vivaldi | `vivaldi://extensions` |
   | Microsoft Edge | `edge://extensions` |

3. Enable **Developer mode**.
4. Select **Load unpacked** (the wording may vary slightly by browser).
5. Choose the extracted project folder containing `manifest.json`.

> Manual installation is intended for local or development use. Your browser may show a warning for unpacked extensions.

### Other browsers

- **Safari:** not currently supported.
- **Mobile browsers:** not currently supported.

## Usage

1. Open a compatible page containing visible test results.
2. Click the **Test Results Exporter** extension icon.
3. Choose whether to export **all tests** or **failed tests only**.
4. Wait for the progress indicator to finish.
5. Open the JSON file downloaded by your browser.

Example output:

```json
{
  "exportedAt": "2026-06-25T12:00:00.000Z",
  "results": [
    {
      "categoryPath": ["feature", "edge cases"],
      "name": "empty input",
      "status": "failed",
      "failures": [
        {
          "label": "Failure #0",
          "diff": "expect(received).toEqual(expected) ..."
        }
      ]
    }
  ]
}
```

## Compatibility

The extension is intended for pages where test names, statuses, and failure messages are visibly rendered in the DOM. Since test platforms use different layouts, results may vary across websites.

## Development

### Requirements

- A recent desktop version of Firefox, Chrome, Chromium, Brave, Opera, Vivaldi, or Microsoft Edge
- Node.js only when generating release archives

### Build release packages

```bash
node scripts/build.mjs
```

Generated packages are written to `dist/`:

- Firefox / AMO archive
- Chrome manual-install archive
- Source archive

## Project structure

```text
.
├── icons/                  # Extension icons
├── scripts/                # Packaging scripts
├── docs/                   # Privacy policy and public pages
├── manifest.json           # Chrome / Chromium manifest
├── manifest.firefox.json   # Firefox-specific manifest
├── popup.html              # Extension popup
├── popup.js                # Export logic and UI behavior
└── popup.css               # Popup styles
```

## Feedback and issues

Use the [issue tracker](https://github.com/theodevelop/test-results-exporter/issues) to report a bug, suggest an improvement, or share a compatibility issue with a page layout.

## License

Distributed under the [MIT License](LICENSE).

---

Published by **theodevelop**.
