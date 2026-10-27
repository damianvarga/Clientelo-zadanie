(function () {
  "use strict";

  var dividendInput = document.getElementById("tax-dividend");
  var w8benChips = document.querySelectorAll("[data-w8ben]");
  var resultTax = document.getElementById("tax-result-tax");
  var resultNet = document.getElementById("tax-result-net");
  var resultSavings = document.getElementById("tax-result-savings");
  var result10yr = document.getElementById("tax-result-10yr");
  var result20yr = document.getElementById("tax-result-20yr");
  var emailBtn = document.getElementById("tax-email-btn");
  var container = document.getElementById("dan");

  if (!container || !dividendInput) return;

  var state = { annualDividend: 0, hasW8ben: true };

  function fmtCzk(v) {
    return Math.round(v).toLocaleString("cs-CZ").replace(/\u00a0/g, " ");
  }

  function calculate() {
    var annual = Math.max(0, Number(dividendInput.value) || 0);
    var hasW8ben = state.hasW8ben;
    state.annualDividend = annual;

    var rate = hasW8ben ? 0.15 : 0.30;
    var tax = annual * rate;
    var net = annual - tax;
    var savings = annual * 0.15;
    var savings10 = savings * 10;
    var savings20 = savings * 20;

    resultTax.textContent = fmtCzk(tax);
    resultNet.textContent = fmtCzk(net);
    resultSavings.textContent = fmtCzk(savings);
    result10yr.textContent = fmtCzk(savings10);
    result20yr.textContent = fmtCzk(savings20);

    window.etfTaxState = {
      annualDividend: annual,
      hasW8ben: hasW8ben,
      taxRate: rate,
      taxWithheld: Math.round(tax),
      netAmount: Math.round(net),
      annualSavings: Math.round(savings),
      savings10yr: Math.round(savings10),
      savings20yr: Math.round(savings20)
    };

    emailBtn.disabled = false;
  }

  dividendInput.addEventListener("input", calculate);

  w8benChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      w8benChips.forEach(function (c) {
        c.classList.remove("is-active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-pressed", "true");
      state.hasW8ben = chip.getAttribute("data-w8ben") === "true";
      calculate();
    });
  });

  calculate();

  emailBtn.hidden = false;

  emailBtn.addEventListener("click", function (e) {
    e.preventDefault();
    var reportSection = document.getElementById("report");
    if (reportSection) {
      reportSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
})();
