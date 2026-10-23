// ==UserScript==
// @name         Pure Dark Mode
// @namespace    https://github.com/raaji9/greasy-dork
// @version      1.1
// @description  Pure color inversion dark mode with per-site exclusion management.
// @author       raaji9
// @homepage     https://github.com/raaji9/greasy-dork
// @icon         data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f1c40f'><path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'/></svg>
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL  https://raw.githubusercontent.com/raaji9/greasy-dork/main/pure-dark-mode.user.js
// @updateURL    https://raw.githubusercontent.com/raaji9/greasy-dork/main/pure-dark-mode.user.js
// ==/UserScript==

(() => {
  'use strict';

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Extract the hostname (domain) from the current page URL.
   * @returns {string} The hostname (e.g., 'example.com')
   */
  const getCurrentDomain = () => new URL(window.location.href).hostname;

  /**
   * Retrieve the list of excluded domains from storage.
   * @returns {string[]} Array of domain names that should not use dark mode
   */
  const getExcluded = () => JSON.parse(GM_getValue('excludedSites', '[]'));

  /**
   * Save the exclusion list to storage.
   * @param {string[]} sites - Array of domains to exclude from dark mode
   */
  const saveExcluded = (sites) => GM_setValue('excludedSites', JSON.stringify(sites));

  /**
   * Check if the current domain is in the exclusion list.
   * @returns {boolean} True if dark mode should be disabled on this site
   */
  const isExcluded = () => getExcluded().includes(getCurrentDomain());

  // ============================================================================
  // ICON DEFINITIONS
  // ============================================================================

  const viewIcon = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2361affe"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>';
  const clearIcon = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff6b6b"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"/></svg>';

  // ============================================================================
  // MENU COMMAND HANDLERS
  // ============================================================================

  /**
   * Toggle dark mode for the current domain.
   * Adds the domain to the exclusion list if dark mode is active,
   * or removes it if dark mode is already disabled.
   */
  const toggleExclusion = () => {
    const domain = getCurrentDomain();
    const excluded = getExcluded();
    const idx = excluded.indexOf(domain);

    // If domain is already excluded, remove it
    // Otherwise, add it to the exclusion list
    if (idx > -1) {
      excluded.splice(idx, 1);
    } else {
      excluded.push(domain);
    }

    saveExcluded(excluded);
    location.reload();
  };

  /**
   * Display all currently excluded domains in an alert dialog.
   */
  const viewExcluded = () => {
    const excluded = getExcluded();
    alert(excluded.length ? excluded.join('\n') : 'None excluded');
  };

  /**
   * Clear all exclusions after user confirmation.
   */
  const clearExcluded = () => {
    if (confirm('Clear all exclusions?')) {
      GM_setValue('excludedSites', '[]');
      location.reload();
    }
  };

  // ============================================================================
  // MENU REGISTRATION
  // ============================================================================

  // Register toggle command with context-aware sun/moon icon:
  GM_registerMenuCommand(
  'Toggle dark mode',
  toggleExclusion,
  {
    id: 'toggle_darkmode',
    icon: isExcluded()
      ? 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f1c40f"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><circle cx="12" cy="12" r="4"/></svg>'
      : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2361affe"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
  }
);

  // Register command to view all excluded domains with eye icon
  GM_registerMenuCommand(
    'View excluded',
    viewExcluded,
    { id: 'view_excluded', icon: viewIcon }
  );

  // Register command to clear all exclusions at once with trash icon
  GM_registerMenuCommand(
    'Clear all',
    clearExcluded,
    { id: 'clear_excluded', icon: clearIcon }
  );

  // ============================================================================
  // DARK MODE APPLICATION
  // ============================================================================

  // Only apply dark mode if the current domain is not in the exclusion list
  if (!isExcluded()) {
    const style = document.createElement('style');

    // CSS filter strategy:
    // - invert(1): Flips all colors (white ↔ black)
    // - hue-rotate(180deg): Restores natural color appearance after inversion
    //   (e.g., blue stays blue instead of becoming yellow)
    style.textContent = `
      /* Main dark mode inversion */
      html {
        filter: invert(1) hue-rotate(180deg) !important;
        background-color: #fff !important;
        color-scheme: dark !important;
      }

      /* Invert media back to original appearance (double-invert cancellation) */
      img, video, canvas, iframe, [style*="background-image"], svg:not([data-icon]), .emoji {
        filter: invert(1) hue-rotate(180deg) !important;
      }

      /* Preserve icon appearance (if marked with data-icon attribute) */
      svg[data-icon] {
        filter: none !important;
      }
    `;

    document.documentElement.appendChild(style);
  }
})();
