// ==UserScript==
// @name         URL Redirector
// @namespace    https://github.com/raaji9/greasy-dork
// @version      1.0
// @description  Redirects Instagram, Snapchat, and X to no-login frontends (Imginn, ViewSnapStories, TwitterViewer). Toggle each site from the Violentmonkey menu.
// @author       raaji9
// @homepage     https://github.com/raaji9/greasy-dork
// @icon         data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236c5ce7' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M4 9a8 8 0 0 1 14-3l2 2'/><path d='M20 3v5h-5'/><path d='M20 15a8 8 0 0 1-14 3l-2-2'/><path d='M4 21v-5h5'/></svg>
// @license      MIT
// @match        *://*.instagram.com/*
// @match        *://*.snapchat.com/*
// @match        *://*.x.com/*
// @match        *://*.twitter.com/*
// @run-at       document-start
// @noframes
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL  https://raw.githubusercontent.com/raaji9/greasy-dork/main/url-redirector.user.js
// @updateURL    https://raw.githubusercontent.com/raaji9/greasy-dork/main/url-redirector.user.js
// ==/UserScript==

// Redirects social media URLs to no-login mirrors.
// Each entry in `redirects` maps a source domain to a target domain.
// Optional `transform` key applies a path rewrite (see below).
//
// To add a site:
//   1. Add an entry to `redirects`
//   2. If the target uses a different path structure, add a transform case
//      in the "transforms" section of the IIFE
//   3. Add its favicon to `icons` for the menu

const redirects = {
  "instagram.com": { target: "imginn.com", label: "Instagram" },
  "snapchat.com":  { target: "viewsnapstories.com", label: "Snapchat", transform: "viewsnap" },
  "x.com":         { target: "twitterviewer.net", label: "X (Twitter)" },
};

const icons = {
  "instagram.com": "https://www.instagram.com/favicon.ico",
  "snapchat.com":  "https://www.snapchat.com/favicon.ico",
  "x.com":         "https://x.com/favicon.ico",
};

// menu toggles, click the Violentmonkey icon to flip each site on/off
for (const [host, rule] of Object.entries(redirects)) {
  const key = `redirect_${host}`;
  const isOn = GM_getValue(key, 'on') !== 'off';

  GM_registerMenuCommand(
    `${rule.label} [${isOn ? 'ON' : 'OFF'}]`,
    () => {
      GM_setValue(key, GM_getValue(key, 'on') === 'off' ? 'on' : 'off');
      location.reload();
    },
    { id: `toggle_${host}`, icon: icons[host] }
  );
}

(function () {
  const host = location.hostname.replace(/^www\./, '');
  const rule = redirects[host];
  if (!rule) return;
  if (GM_getValue(`redirect_${host}`, 'on') === 'off') return;

  let path = location.pathname + location.search + location.hash;

  // login-redirect recovery
  // some sites 302 to a login page before you get the actual content,
  // so we pull the real target out of the query params

  // instagram: /accounts/login/?next=https://www.instagram.com/username/
  if (host === 'instagram.com' && path.includes('/accounts/login/')) {
    const next = new URLSearchParams(location.search).get('next');
    if (next) path = new URL(next, location.origin).pathname;
  }

  // twitterviewer: /i/jf/onboarding/web?redirect_after_login=/username/
  if (host === 'twitterviewer.net' && path.includes('/onboarding/')) {
    const after = new URLSearchParams(location.search).get('redirect_after_login');
    if (after) path = after;
  }

  // transforms: rewrite the path to match the target's URL structure

  // instagram: imginn puts /tagged before the username
  if (host === 'instagram.com') {
    const tagged = path.match(/^\/([^/]+)\/tagged\/?$/);
    if (tagged) path = `/tagged/${tagged[1]}/`;
  }

  // snapchat to viewsnapstories
  if (rule.transform === 'viewsnap') {
    // /@user/spotlight/12345 to /profile/user/spotlight
    path = path.replace(/^\/@([^/]+)\/(spotlight|highlights)\/.+$/, '/profile/$1/$2');
    // /@user to /profile/user
    path = path.replace(/^\/@([^/]+)(\/.*)?$/, '/profile/$1$2');
    // /topic/username-spotlight to /profile/username/spotlight
    const m = path.match(/^\/topic\/(.+)-(show-highlights|spotlight)$/);
    if (m) path = `/profile/${m[1]}/${m[2] === 'show-highlights' ? 'highlights' : m[2]}`;
  }

  location.replace(`https://${rule.target}${path}`);
})();   
