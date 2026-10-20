# greasy-dork

Personal collection of user scripts.

## Scripts

| Script | Description |
|--------|-------------|
| [URL Redirector](#url-redirector) | Redirects social media sites to no-login frontends |
| [Force Dark Mode](#force-dark-mode) | Forces dark mode on all sites via matchMedia + localStorage override |
| *(more coming)* | |

---

## URL Redirector

Redirects Instagram, Snapchat, and X to no-login-required frontends. Each site can be toggled on/off individually from the Violentmonkey menu.

| Platform | Redirects To |
|----------|-------------|
| Instagram | Imginn |
| Snapchat | ViewSnapStories |
| X (Twitter) | TwitterViewer |

### How it works

- Maps source domains to target mirror domains
- Handles login-redirect recovery (e.g. Instagram's `/accounts/login/?next=...`)
- Rewrites paths to match the target site's URL structure where needed
- State persists across sessions via `GM_getValue` / `GM_setValue`

### Install

1. Install [Violentmonkey](https://violentmonkey.github.io/)
2. Install [URL Redirector](https://greasyfork.org/en/scripts/601198-url-redirector) from GreasyFork
3. Click the Violentmonkey icon in your browser toolbar to toggle individual sites on/off

### Adding a new redirect

1. Add an entry to the `redirects` object at the top of the script
2. If the target uses a different path structure, add a transform case in the IIFE (search for `transforms`)
3. Add the source favicon to the `icons` object for the menu label

### Known limitations

- Only handles the three platforms listed above
- Path transforms are hardcoded per-site; new targets may need their own
- If a mirror changes its URL structure, transforms will need updating

---

## Force Dark Mode

Forces dark mode on every site by overriding `window.matchMedia` to report `prefers-color-scheme: dark` and pre-setting common `localStorage` theme keys before site scripts run.

### Install

1. Install [Violentmonkey](https://violentmonkey.github.io/)
2. Install [Force Dark Mode](https://greasyfork.org/en/scripts/XXXXXX-force-dark-mode) from GreasyFork

### Usage

No interaction needed. The script runs automatically on every page at `document-start`, before site scripts execute. Sites that check `prefers-color-scheme` or read common localStorage theme keys will see dark mode.

### Excluding a site

Add an `@exclude` line to the script header for any site where forced dark mode breaks the UI:

<!--
## New Script Name

One-line description.

### Install

1. Install [Violentmonkey](https://violentmonkey.github.io/)
2. Install from GreasyFork

### Usage

How to use it.

---
-->

## License

[MIT](./LICENSE)   
