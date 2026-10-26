(function () {
  "use strict";

  var ETF_DATA = [
    { ticker: "VOO", name: "Vanguard S&P 500 ETF", ter: 0.03 },
    { ticker: "IVV", name: "iShares Core S&P 500 ETF", ter: 0.03 },
    { ticker: "SPY", name: "SPDR S&P 500 ETF Trust", ter: 0.0945 },
    { ticker: "QQQ", name: "Invesco QQQ ETF", ter: 0.18 },
    { ticker: "VTI", name: "Vanguard Total Stock Market ETF", ter: 0.03 },
    { ticker: "SCHD", name: "Schwab U.S. Dividend Equity ETF", ter: 0.06 }
  ];

  var GROSS = 0.08;
  var INITIAL = 100000;
  var MONTHLY = 3000;
  var YEARS = 25;
  var CHEAPEST_TER = 0.03;
  var AVG_TER = 0.41;

  var allocationsEl = document.getElementById("portfolio-allocations");
  var totalEl = document.getElementById("portfolio-total");
  var totalHintEl = document.getElementById("portfolio-total-hint");
  var resultEl = document.getElementById("portfolio-result");
  var emailBtnEl = document.getElementById("portfolio-email-btn");
  var container = document.getElementById("portfolio");

  if (!allocationsEl || !container) return;

  var state = {};
  ETF_DATA.forEach(function (f) { state[f.ticker] = 0; });

  function futureValue(principal, monthly, years, rate) {
    var r = rate / 12;
    var n = years * 12;
    if (r === 0) return principal + monthly * n;
    var growth = Math.pow(1 + r, n);
    return principal * growth + monthly * ((growth - 1) / r);
  }

  function fmtCzk(v) {
    return Math.round(v).toLocaleString("cs-CZ").replace(/\u00a0/g, " ");
  }

  function fmtTer(v) {
    return v.toLocaleString("cs-CZ", { minimumFractionDigits: 2, maximumFractionDigits: 4 }).replace(/,00$/, ",00") + " %";
  }

  function renderAllocations() {
    var html = "";
    ETF_DATA.forEach(function (f) {
      var w = state[f.ticker] || 0;
      html += "<div class=\"portfolio-row\" data-ticker=\"" + f.ticker + "\">" +
        "<div class=\"portfolio-row__label\">" +
          "<span class=\"portfolio-row__ticker badge badge--green\">" + f.ticker + "</span>" +
          "<span class=\"portfolio-row__name\">" + f.name + "</span>" +
          "<span class=\"portfolio-row__ter\">TER " + fmtTer(f.ter) + "</span>" +
        "</div>" +
        "<div class=\"portfolio-row__controls\">" +
          "<input type=\"range\" min=\"0\" max=\"100\" step=\"1\" value=\"" + w + "\" data-ticker=\"" + f.ticker + "\">" +
          "<input type=\"number\" min=\"0\" max=\"100\" step=\"1\" value=\"" + w + "\" data-ticker=\"" + f.ticker + "\" class=\"portfolio-row__num\">" +
          "<span class=\"portfolio-row__unit\">%</span>" +
        "</div>" +
      "</div>";
    });
    allocationsEl.innerHTML = html;

    document.querySelectorAll(".portfolio-row input[type=\"range\"]").forEach(function (input) {
      input.addEventListener("input", function () {
        var ticker = this.getAttribute("data-ticker");
        var val = Number(this.value);
        state[ticker] = val;
        var numInput = document.querySelector(".portfolio-row__num[data-ticker=\"" + ticker + "\"]");
        if (numInput) numInput.value = val;
        update();
      });
    });

    document.querySelectorAll(".portfolio-row__num").forEach(function (input) {
      input.addEventListener("input", function () {
        var ticker = this.getAttribute("data-ticker");
        var val = Math.max(0, Math.min(100, Number(this.value) || 0));
        state[ticker] = val;
        var rangeInput = document.querySelector(".portfolio-row input[type=\"range\"][data-ticker=\"" + ticker + "\"]");
        if (rangeInput) rangeInput.value = val;
        update();
      });
    });

    update();
  }

  function update() {
    var total = Object.values(state).reduce(function (a, b) { return a + b; }, 0);
    var isComplete = total === 100;

    totalEl.textContent = total + " %";
    totalEl.classList.toggle("is-complete", isComplete);
    totalEl.classList.toggle("is-incomplete", !isComplete);

    if (totalHintEl) {
      if (isComplete) {
        totalHintEl.textContent = "Portfólio je kompletné.";
        totalHintEl.className = "portfolio-total__hint is-ok";
      } else if (total > 100) {
        totalHintEl.textContent = "Presahuje 100 % o " + (total - 100) + " percentových bodov.";
        totalHintEl.className = "portfolio-total__hint is-err";
      } else {
        totalHintEl.textContent = "Chýbajú " + (100 - total) + " percentové body do 100 %.";
        totalHintEl.className = "portfolio-total__hint is-err";
      }
    }

    var weightedTer = 0;
    ETF_DATA.forEach(function (f) {
      weightedTer += (state[f.ticker] || 0) / 100 * f.ter;
    });

    if (isComplete) {
      var grossFv = futureValue(INITIAL, MONTHLY, YEARS, GROSS);
      var yourFv = futureValue(INITIAL, MONTHLY, YEARS, GROSS - weightedTer / 100);
      var cheapFv = futureValue(INITIAL, MONTHLY, YEARS, GROSS - CHEAPEST_TER / 100);
      var avgFv = futureValue(INITIAL, MONTHLY, YEARS, GROSS - AVG_TER / 100);

      var yourFees = grossFv - yourFv;
      var cheapFees = grossFv - cheapFv;
      var avgFees = grossFv - avgFv;

      var gapVsCheap = cheapFv - yourFv;
      var gapVsAvg = avgFv - yourFv;

      resultEl.innerHTML = "" +
        "<h3 class=\"portfolio-result__title\">Modelový výsledok po " + YEARS + " rokoch</h3>" +
        "<div class=\"portfolio-result__grid\">" +
          "<div class=\"portfolio-result__item\">" +
            "<p class=\"portfolio-result__label\">Váhované TER portfólia</p>" +
            "<p class=\"portfolio-result__value num\">" + fmtTer(weightedTer) + "</p>" +
          "</div>" +
          "<div class=\"portfolio-result__item portfolio-result--yours\">" +
            "<p class=\"portfolio-result__label\">Vaše portfólio – koncová hodnota</p>" +
            "<p class=\"portfolio-result__value num\">" + fmtCzk(yourFv) + " Kč</p>" +
            "<p class=\"portfolio-result__note\">Odvodené poplatky: " + fmtCzk(yourFees) + " Kč</p>" +
          "</div>" +
          "<div class=\"portfolio-result__item portfolio-result--cheap\">" +
            "<p class=\"portfolio-result__label\">Najlacnejšie ETF (0,03 %)</p>" +
            "<p class=\"portfolio-result__value num\">" + fmtCzk(cheapFv) + " Kč</p>" +
            "<p class=\"portfolio-result__note\">Odvodené poplatky: " + fmtCzk(cheapFees) + " Kč</p>" +
          "</div>" +
          "<div class=\"portfolio-result__item portfolio-result--avg\">" +
            "<p class=\"portfolio-result__label\">Priemerný fond (0,41 %)</p>" +
            "<p class=\"portfolio-result__value num\">" + fmtCzk(avgFv) + " Kč</p>" +
            "<p class=\"portfolio-result__note\">Odvodené poplatky: " + fmtCzk(avgFees) + " Kč</p>" +
          "</div>" +
        "</div>" +
        (gapVsCheap > 1
          ? "<p class=\"portfolio-result__gap down\">O " + fmtCzk(gapVsCheap) + " Kč menej než pri najlevnom ETF (0,03 %)</p>"
          : "<p class=\"portfolio-result__gap up\">Ste na úrovni najlevnejšieho ETF.</p>") +
        (gapVsAvg > 1
          ? "<p class=\"portfolio-result__gap up\">O " + fmtCzk(gapVsAvg) + " Kč viac než pri priemernom fonde (0,41 %)</p>"
          : "");

      resultEl.hidden = false;
      emailBtnEl.hidden = false;

      window.etfPortfolioState = {
        allocations: Object.assign({}, state),
        weightedTer: weightedTer,
        yourFinalValue: Math.round(yourFv),
        cheapFinalValue: Math.round(cheapFv),
        avgFinalValue: Math.round(avgFv),
        gapVsCheapest: Math.round(gapVsCheap),
        gapVsAverage: Math.round(gapVsAvg),
        years: YEARS,
        initial: INITIAL,
        monthly: MONTHLY
      };

      if (window.etfTrack) {
        window.etfTrack("portfolio_complete", { ter: weightedTer, allocations: JSON.stringify(state) });
      }
    } else {
      resultEl.hidden = true;
      emailBtnEl.hidden = true;
      window.etfPortfolioState = null;
    }
  }

  renderAllocations();
})();
