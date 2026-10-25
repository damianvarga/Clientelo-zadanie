(function () {
  "use strict";

  var ETFS = [
    { ticker: "VOO", name: "Vanguard S&P 500 ETF", index: "S&P 500", ter: 0.03, year: 2010, aum: 1032 },
    { ticker: "IVV", name: "iShares Core S&P 500 ETF", index: "S&P 500", ter: 0.03, year: 2000, aum: 874 },
    { ticker: "SPY", name: "SPDR S&P 500 ETF Trust", index: "S&P 500", ter: 0.0945, year: 1993, aum: 1100 },
    { ticker: "QQQ", name: "Invesco QQQ ETF", index: "Nasdaq-100", ter: 0.18, year: 1999, aum: 320 },
    { ticker: "VTI", name: "Vanguard Total Stock Market ETF", index: "Celý trh USA", ter: 0.03, year: 2001, aum: 689 },
    { ticker: "SCHD", name: "Schwab U.S. Dividend Equity ETF", index: "Dow Jones U.S. Dividend 100", ter: 0.06, year: 2011, aum: 119 }
  ];

  var LOW_TER = 0.03;
  var tbody = document.getElementById("etf-tbody");
  if (!tbody) return;

  var state = { sort: "ter", dir: 1 };

  function fmtTer(v) {
    return v.toLocaleString("cs-CZ", { minimumFractionDigits: 2, maximumFractionDigits: 4 }).replace(/,00$/, ",00") + " %";
  }

  function render() {
    var rows = ETFS.slice().sort(function (a, b) {
      var k = state.sort;
      var av = a[k], bv = b[k];
      if (typeof av === "string") return av.localeCompare(bv) * state.dir;
      return (av - bv) * state.dir;
    });

    tbody.innerHTML = rows.map(function (f) {
      var cls = f.ter > 0.05 ? "ter-pill ter-pill--high" : "ter-pill";
      return "<tr>" +
        '<td><span class="ticker">' + f.ticker + "</span>" +
        '<span class="fund-name">' + f.name + "</span></td>" +
        "<td>" + f.index + "</td>" +
        '<td class="is-num"><span class="' + cls + '">' + fmtTer(f.ter) + "</span></td>" +
        '<td class="is-num num">' + f.year + "</td>" +
        '<td class="is-num num is-hide-sm">' + f.aum.toLocaleString("cs-CZ") + " mld. $</td>" +
        "</tr>";
    }).join("");
  }

  document.querySelectorAll(".sort-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-sort");
      if (state.sort === key) {
        state.dir *= -1;
      } else {
        state.sort = key;
        state.dir = key === "ticker" ? 1 : (key === "ter" ? 1 : -1);
      }
      document.querySelectorAll(".sort-btn").forEach(function (b) {
        b.classList.remove("is-asc", "is-desc");
      });
      btn.classList.add(state.dir === 1 ? "is-asc" : "is-desc");
      render();
      if (window.etfTrack) window.etfTrack("table_sort", { by: key, dir: state.dir });
    });
  });

  render();
})();
