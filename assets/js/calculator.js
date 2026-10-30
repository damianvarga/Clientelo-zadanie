(function () {
  "use strict";

  var GROSS = 0.08;
  var CHEAPEST_TER = 0.03;

  var els = {
    initial: document.getElementById("c-initial"),
    monthly: document.getElementById("c-monthly"),
    years: document.getElementById("c-years"),
    yearsOut: document.getElementById("c-years-out"),
    final: document.getElementById("r-final"),
    fees: document.getElementById("r-fees"),
    feesNote: document.getElementById("r-fees-note"),
    gap: document.getElementById("r-gap"),
    gapNote: document.getElementById("r-gap-note"),
    heroLoss: document.getElementById("hero-loss"),
    stickyNum: document.getElementById("sticky-num")
  };

  if (!els.initial) return;

  var state = { initial: null, monthly: null, years: null, ter: null, fund: null };
  var isDirty = false;

  function futureValue(principal, monthly, years, rate) {
    var r = rate / 12;
    var n = years * 12;
    if (r === 0) return principal + monthly * n;
    var growth = Math.pow(1 + r, n);
    return principal * growth + monthly * ((growth - 1) / r);
  }

  function fmtCzk(v) {
    return Math.round(v).toLocaleString("cs-CZ").replace(/\u00a0/g, " ") + " Kč";
  }

  function compute(ter) {
    var initial = Math.max(0, Number(els.initial.value) || 0);
    var monthly = Math.max(0, Number(els.monthly.value) || 0);
    var years = Number(els.years.value) || 1;
    var grossFv = futureValue(initial, monthly, years, GROSS);
    var netFv = futureValue(initial, monthly, years, Math.max(0, GROSS - ter / 100));
    var feesPaid = grossFv - netFv;
    return { initial: initial, monthly: monthly, years: years, grossFv: grossFv, netFv: netFv, feesPaid: feesPaid };
  }

  function update() {
    var ter = state.ter !== null ? state.ter : CHEAPEST_TER;
    var r = compute(ter);
    var cheap = compute(CHEAPEST_TER);
    var gap = cheap.netFv - r.netFv;

    els.yearsOut.textContent = r.years + " let";
    els.final.textContent = fmtCzk(r.netFv);
    els.fees.textContent = fmtCzk(r.feesPaid);
    els.feesNote.textContent =
      "Při " + (state.fund || "VOO / IVV / VTI") + " (TER " + (state.ter !== null ? state.ter : CHEAPEST_TER).toLocaleString("cs-CZ") +
      " %) strhne správce fondu zhruba tolik – bez vámi viditelné položky ve výpisu.";
    els.gap.textContent = gap > 1 ? "− " + fmtCzk(gap) : "0 Kč";
    els.gapNote.textContent = gap > 1
      ? "Tolik méně byste měli za stejných podmínek na nejlevnějším ETF (0,03 %)."
      : "Držíte už nejlevnější variantu.";

    var lossText = fmtCzk(gap > 1 ? gap : cheap.feesPaid).replace(/\s/g, "\u00a0");
    if (els.heroLoss) {
      els.heroLoss.textContent = state.ter !== null && state.ter > 0.03 ? lossText : "235\u00a0000\u00a0Kč";
    }

    if (isDirty) {
      window.etfCalcState = {
        initial: r.initial,
        monthly: r.monthly,
        years: r.years,
        gross: GROSS,
        ter: state.ter !== null ? state.ter : CHEAPEST_TER,
        fund: state.fund || "VOO / IVV / VTI",
        finalValue: Math.round(r.netFv),
        feesPaid: Math.round(r.feesPaid),
        gapVsCheapest: Math.round(gap),
        finalValueCheapest: Math.round(cheap.netFv),
        feesPaidCheapest: Math.round(cheap.feesPaid)
      };
    }

    if (window.etfTrack && els.stickyNum) {
      els.stickyNum.textContent = isDirty ? "ztráta " + fmtCzk(r.feesPaid) : "";
    }
  }

  function markDirty() {
    isDirty = true;
  }

  ["initial", "monthly"].forEach(function (k) {
    els[k].addEventListener("input", function () { markDirty(); update(); });
  });
  els.years.addEventListener("input", function () { markDirty(); update(); });

  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      document.querySelectorAll(".chip").forEach(function (c) {
        c.classList.remove("is-active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-pressed", "true");
      state.ter = Number(chip.getAttribute("data-ter"));
      state.fund = chip.getAttribute("data-fund");
      markDirty();
      update();
      if (window.etfTrack) window.etfTrack("calc_change", { ter: state.ter, fund: state.fund });
    });
  });

  window.etfCalcDisplay = { compute: compute, fmtCzk: fmtCzk, GROSS: GROSS };
})();
