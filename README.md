# Test Results Exporter

A Manifest V3 browser extension that exports visible test results from compatible pages to a local JSON file.

## Features

- Exports test categories and names.
- Captures visible statuses: passed, failed, or unknown.
- Includes visible failure messages and diffs when available.
- Shows progress while an export runs.

## Privacy

The extension runs in the active tab after the user starts an export. It does not send data to an external service. Generated JSON files are downloaded locally.

Read the full [Privacy Policy](docs/PRIVACY_POLICY.md).

## Development

### Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Select **Load Temporary Add-on**.
3. Select `manifest.json` from this repository.

### Chrome, Chromium, and Brave

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this repository folder.

## Build packages

```bash
node scripts/build.mjs
```

The generated browser packages are written to `dist/`.

## License

[MIT](LICENSE) © 2026 Théo Irujo.
