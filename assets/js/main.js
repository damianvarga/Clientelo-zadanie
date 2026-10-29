(function () {
  "use strict";

  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];

  function captureUtm() {
    var params = new URLSearchParams(window.location.search);
    var stored = {};
    var changed = false;
    UTM_KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) { stored[k] = v; changed = true; }
    });
    if (changed) {
      try { localStorage.setItem("etf_utm", JSON.stringify(stored)); } catch (e) {}
    }
    try {
      return JSON.parse(localStorage.getItem("etf_utm") || "{}");
    } catch (e) { return {}; }
  }

  function track(name, data) {
    var payload = Object.assign({ event: name }, data || {});
    if (Array.isArray(window.dataLayer)) { window.dataLayer.push(payload); }
    if (typeof window.va === "function") {
      try { window.va("track", name, payload); } catch (e) {}
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.debug("[track]", payload);
    }
  }

  window.etfTrack = track;
  window.etfUtm = captureUtm();

  track("page_view", {
    path: window.location.pathname,
    referrer: document.referrer || null
  });

  document.addEventListener("click", function (e) {
    if (!(e.target instanceof Element)) return;
    var el = e.target.closest("[data-cta]");
    if (!el) return;
    track("cta_click", { cta: el.getAttribute("data-cta") });
  });

  var faq = document.getElementById("faq");
  if (faq) {
    faq.addEventListener("toggle", function (e) {
      if (e.target.open) track("faq_open", { q: e.target.querySelector("summary").textContent.trim() });
    }, true);
  }

  var sticky = document.getElementById("sticky-cta");
  var leadSection = document.getElementById("report");
  if (sticky && leadSection) {
    var hero = document.querySelector(".hero");
    var pastHero = false;
    var inLead = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target === hero) pastHero = !entry.isIntersecting;
        if (entry.target === leadSection) inLead = entry.isIntersecting;
      });
      var show = pastHero && !inLead;
      sticky.hidden = false;
      sticky.classList.toggle("is-visible", show);
    }, { threshold: 0.15 });
    if (hero) observer.observe(hero);
    observer.observe(leadSection);
  }

  var form = document.getElementById("lead-form");
  if (!form) return;

  var emailInput = document.getElementById("lf-email");
  var emailError = document.getElementById("lf-email-error");
  var consent = document.getElementById("lf-consent");
  var honeypot = document.getElementById("lf-company");
  var submit = document.getElementById("lf-submit");
  var status = document.getElementById("lf-status");
  var formOpened = false;

  var focusObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !formOpened) {
        formOpened = true;
        track("form_view", {});
      }
    });
  }, { threshold: 0.4 });
  focusObserver.observe(form);

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function setStatus(msg, ok) {
    status.textContent = msg || "";
    status.classList.toggle("is-ok", !!ok);
    status.classList.toggle("is-err", !ok && !!msg);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setStatus("", false);

    var email = emailInput.value.trim();
    if (!validEmail(email)) {
      emailError.hidden = false;
      emailInput.focus();
      track("form_error", { field: "email" });
      return;
    }
    emailError.hidden = true;

    if (!consent.checked) {
      setStatus("Zaškrtněte souhlas se zpracováním e-mailu.", false);
      track("form_error", { field: "consent" });
      return;
    }

    if (honeypot.value) {
      setStatus("Děkujeme.", true);
      return;
    }

    var body = {
      email: email,
      consent: true,
      utm: window.etfUtm || {},
      calc: window.etfCalcState || null,
      portfolio: window.etfPortfolioState || null,
      tax: window.etfTaxState || null,
      page: window.location.pathname,
      referrer: document.referrer || null,
      ts: new Date().toISOString()
    };

    submit.disabled = true;
    setStatus("Odesílám…", false);

    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(function (res) {
        if (!res.ok && res.status !== 200) {
          var httpErr = new Error("HTTP " + res.status);
          httpErr.isHttp = true;
          throw httpErr;
        }
        return res.json().catch(function () { return {}; });
      })
      .then(function (data) {
        var reportId = data && typeof data.reportId === "string" ? data.reportId : "";
        if (!reportId) {
          var idErr = new Error("server_nevracel_reportId");
          idErr.isHttp = true;
          throw idErr;
        }
        try {
          sessionStorage.setItem("etf_report", JSON.stringify({
            email: email,
            sentAt: new Date().toISOString()
          }));
        } catch (err) {}
        track("form_submit", { ok: true });
        window.location.href = "/thank-you.html?id=" + encodeURIComponent(reportId);
      })
      .catch(function (err) {
        if (!err.isHttp && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
          setStatus("Lokální statický server nemá API. Pro plný test (odeslání + PDF) použijte `npx vercel dev`, nebo deploy na Vercel.", false);
          submit.disabled = false;
          return;
        }
        console.error(err);
        setStatus("Odeslání se nepovedlo. Zkuste to prosím znovu za chvíli.", false);
        submit.disabled = false;
        track("form_error", { field: "network" });
      });
  });
})();
