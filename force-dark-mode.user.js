// ==UserScript==
// @name         Force Dark Mode
// @namespace    https://github.com/raaji9/greasy-dork
// @version      1.0.0
// @license      MIT
// @description  Forces dark mode on all sites by overriding matchMedia and common localStorage theme keys.
// @homepage     https://github.com/raaji9/greasy-dork
// @downloadURL  https://raw.githubusercontent.com/raaji9/greasy-dork/main/force-dark-mode.user.js
// @updateURL    https://raw.githubusercontent.com/raaji9/greasy-dork/main/force-dark-mode.user.js
// @match        *://*/*
// @run-at       document-start
// @grant        none
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
