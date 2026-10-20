// ==UserScript==
// @name         Force Dark Mode
// @namespace    https://github.com/raaji9/greasy-dork
// @version      1.0.0
// @description  Forces dark mode on all sites by overriding matchMedia and common localStorage theme keys.
// @author       raaji9
// @homepage     https://github.com/raaji9/greasy-dork
// @icon         data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f1c40f'><path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'/></svg>
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @noframes
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/raaji9/greasy-dork/main/force-dark-mode.user.js
// @updateURL    https://raw.githubusercontent.com/raaji9/greasy-dork/main/force-dark-mode.user.js
// ==/UserScript==

(function() {
  'use strict';

  // 1. Override matchMedia so sites see prefers-color-scheme: dark
  const _matchMedia = window.matchMedia;
  function matchMedia(query) {
    if (query === '(prefers-color-scheme: dark)') {
      return {
        matches: true,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false
      };
    }
    if (query === '(prefers-color-scheme: light)') {
      return {
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false
      };
    }
    return _matchMedia(query);
  }
  window.matchMedia = matchMedia;

  // 2. Set common localStorage theme keys (must run before site JS reads them)
  try { localStorage.setItem('theme', 'dark'); } catch(e) {}
  try { localStorage.setItem('color-scheme', 'dark'); } catch(e) {}
  try { localStorage.setItem('colorScheme', 'dark'); } catch(e) {}
  try { localStorage.setItem('darkMode', 'true'); } catch(e) {}
  try { localStorage.setItem('isDarkMode', 'true'); } catch(e) {}
  try { localStorage.setItem('prefers-color-scheme', 'dark'); } catch(e) {}
})();
