(function () {
  "use strict";

  var KEY = "etf_consent";
  var insightsSrc = "/_vercel/insights/script.js";

  function getConsent() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  function loadInsights() {
    if (document.querySelector('script[src="' + insightsSrc + '"]')) return;
    var s = document.createElement("script");
    s.defer = true;
    s.src = insightsSrc;
    document.head.appendChild(s);
  }

  function hideBanner() {
    var el = document.getElementById("cookie-bar");
    if (el) el.hidden = true;
  }

  function showBanner() {
    var el = document.getElementById("cookie-bar");
    if (el) el.hidden = false;
  }

  window.etfConsent = {
    get: getConsent,
    granted: function () { return getConsent() === "granted"; },
    grant: function () {
      setConsent("granted");
      loadInsights();
      hideBanner();
    },
    deny: function () {
      setConsent("denied");
      hideBanner();
    }
  };

  if (getConsent() === "granted") {
    loadInsights();
    hideBanner();
  } else if (getConsent() === "denied") {
    hideBanner();
  } else {
    showBanner();
  }

  document.addEventListener("click", function (e) {
    if (!(e.target instanceof Element)) return;
    if (e.target.closest("[data-cookie-accept]")) {
      window.etfConsent.grant();
    } else if (e.target.closest("[data-cookie-deny]")) {
      window.etfConsent.deny();
    }
  });
})();
