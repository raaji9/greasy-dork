# greasy-dork

Personal collection of user scripts for enhanced browsing.

## Scripts

| Script | Description |
|--------|-------------|
| [URL Redirector](#url-redirector) | Redirects social media sites to no-login frontends |
| [Pure Dark Mode](#pure-dark-mode) | Forces dark mode via CSS color inversion with per-site exclusion |
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

## Pure Dark Mode

Applies dark mode to every website using pure CSS color inversion (`invert()` + `hue-rotate()`). Automatically inverts media (images, videos, etc.) back to preserve their original appearance. Allows per-site exclusion management via Violentmonkey menu.

### How it works

**Color Inversion Strategy:**
- `invert(1)` flips all colors: white ↔ black, blue ↔ yellow, etc.
- `hue-rotate(180deg)` restores natural color appearance after inversion
- Media elements are inverted twice, canceling out the effect and preserving their original look
- Uses CSS filters only-no JavaScript DOM manipulation, minimal performance impact

**Exclusion System:**
- Maintains a per-domain exclusion list stored locally
- Toggle dark mode on/off for individual sites via Violentmonkey menu
- Changes take effect immediately on page reload

### Install

1. Install [Violentmonkey](https://violentmonkey.github.io/)
2. Install [Pure Dark Mode](https://greasyfork.org/en/scripts/601730-pure-dark-mode) from GreasyFork

### Usage

The script runs automatically on every page before site scripts execute.

**Menu commands** (access via Violentmonkey icon):
- **Toggle dark mode** - Enable or disable dark mode for the current site. Icon changes based on state.
- **View excluded** - Display all sites where dark mode is currently disabled.
- **Clear all** - Remove all exclusions (with confirmation).

### Excluding a site

Click the Violentmonkey icon → **Toggle dark mode** to add the current site to the exclusion list. The page reloads instantly. The menu option changes to **🌙** to indicate dark mode is off.

To re-enable dark mode later, click **Toggle dark mode** again.

### Performance

- Pure CSS-based filtering-zero JavaScript overhead after initial setup
- Single stylesheet injection
- No DOM traversal or manipulation
- Works on all modern browsers supporting CSS `filter` property

### Known limitations

- Some sites with complex custom styling may render incorrectly (use exclusion list for these)
- SVG icons may invert unexpectedly; use `data-icon` attribute to prevent inversion
- Animated backgrounds/videos will be inverted (this is intentional to preserve original appearance)

---

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
