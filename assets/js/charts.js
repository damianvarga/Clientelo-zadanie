(function () {
  "use strict";

  var GREEN = "#0F6B4C";
  var ORANGE = "#B53D22";
  var ORANGE_LIGHT = "#B53D22";
  var INK = "#1A1A1A";
  var INK_SOFT = "#555555";
  var GRID = "#DDD6C8";

  var GROSS = 0.08;
  var CHEAP_TER = 0.03;
  var EXPENSIVE_TER = 0.41;
  var INITIAL = 100000;
  var MONTHLY = 3000;
  var YEARS = 25;

  var priceSvg = document.getElementById("price-chart");
  var feeSvg = document.getElementById("fee-chart");
  var feeCompactSvg = document.getElementById("fee-compact-chart");
  var priceNote = document.getElementById("price-note");
  var fetchedEl = document.getElementById("chart-fetched");
  var tabs = document.querySelectorAll(".chart-tab");

  if (!priceSvg || !feeSvg) return;

  function futureValue(principal, monthly, years, rate) {
    var r = rate / 12;
    var n = years * 12;
    if (r === 0) return principal + monthly * n;
    var growth = Math.pow(1 + r, n);
    return principal * growth + monthly * ((growth - 1) / r);
  }

  function czk(v) {
    return Math.round(v).toLocaleString("cs-CZ").replace(/\u00a0/g, " ");
  }

  function fmtDate(iso) {
    return new Date(iso + "T00:00:00").toLocaleDateString("cs-CZ", { year: "numeric", month: "short", day: "numeric" });
  }

  function clearSvg(svg) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
  }

  function svgEl(tag, attrs) {
    var node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function textEl(x, y, text, opts) {
    opts = opts || {};
    var t = svgEl("text", {
      x: x,
      y: y,
      fill: opts.fill || INK_SOFT,
      "font-size": opts.size || "11px",
      "font-family": "Inter, sans-serif",
      "text-anchor": opts.anchor || "start",
      "dominant-baseline": opts.baseline || "middle"
    });
    if (opts.weight) t.setAttribute("font-weight", opts.weight);
    t.textContent = text;
    return t;
  }

  function drawPriceChart(rows, rangeYears) {
    var w = 800, h = 320;
    var pad = { l: 60, r: 24, t: 18, b: 46 };
    var plotW = w - pad.l - pad.r;
    var plotH = h - pad.t - pad.b;

    clearSvg(priceSvg);
    priceSvg.setAttribute("width", w);
    priceSvg.setAttribute("height", h);

    if (!rows || rows.length < 2) {
      priceNote.textContent = "Historické údaje nie sú k dispozícii.";
      return;
    }

    priceNote.textContent = "";

    var k = Math.min(rows.length, Math.max(2, Math.round(rangeYears * 252)));
    var win = rows.slice(rows.length - k);
    var n = win.length;

    var prices = win.map(function (d) { return d.close; });
    var minP = Math.min.apply(null, prices);
    var maxP = Math.max.apply(null, prices);
    var padP = (maxP - minP) * 0.07 || minP * 0.02;
    var yMin = minP - padP;
    var yMax = maxP + padP;

    function xp(i) { return pad.l + (i / (n - 1)) * plotW; }
    function yp(v) { return h - pad.b - ((v - yMin) / (yMax - yMin)) * plotH; }

    for (var g = 0; g < 5; g++) {
      var vy = yMin + (yMax - yMin) * (g / 4);
      var yy = yp(vy);
      priceSvg.appendChild(svgEl("line", { x1: pad.l, y1: yy, x2: pad.l + plotW, y2: yy, stroke: GRID, "stroke-width": "1" }));
      priceSvg.appendChild(textEl(pad.l - 8, yy, vy.toFixed(0) + " USD", { anchor: "end" }));
    }

    var pts = "";
    for (var i = 0; i < n; i++) pts += xp(i) + "," + yp(prices[i]) + " ";
    priceSvg.appendChild(svgEl("polyline", { points: pts.trim(), fill: "none", stroke: GREEN, "stroke-width": "2" }));

    var lx = xp(n - 1), ly = yp(prices[n - 1]);
    priceSvg.appendChild(svgEl("circle", { cx: lx, cy: ly, r: 3.5, fill: GREEN }));
    var endLabel = prices[n - 1].toFixed(2) + " USD";
    var endHalfW = endLabel.length * 3.2;
    var endTx = Math.min(Math.max(lx, endHalfW + 2), w - endHalfW - 2);
    var endX0 = endTx - endHalfW, endX1 = endTx + endHalfW;
    var endGlyph = 10;

    function endLabelHitsLine(cy) {
      var y0 = cy - endGlyph, y1 = cy + endGlyph;
      var px0 = xp(0), py0 = yp(prices[0]);
      for (var i = 1; i < n; i++) {
        var px1 = xp(i), py1 = yp(prices[i]);
        var ox0 = Math.max(px0, endX0), ox1 = Math.min(px1, endX1);
        if (ox0 <= ox1 && px1 !== px0) {
          var t0 = (ox0 - px0) / (px1 - px0);
          var t1 = (ox1 - px0) / (px1 - px0);
          var ya = py0 + (py1 - py0) * t0;
          var yb = py0 + (py1 - py0) * t1;
          if (Math.min(ya, yb) <= y1 && Math.max(ya, yb) >= y0) return true;
        }
        px0 = px1; py0 = py1;
      }
      return false;
    }

    function endLabelBlocked(cy) {
      if (cy + endGlyph > h - pad.b || cy - endGlyph < pad.t) return true;
      if (Math.abs(cy - ly) < 3.5 + endGlyph) return true;
      return endLabelHitsLine(cy);
    }

    var endCy = null;
    for (var off = 13; off <= 68 && endCy === null; off += 5) {
      if (!endLabelBlocked(ly + off)) endCy = ly + off;
    }
    for (var offA = 14; offA <= 69 && endCy === null; offA += 5) {
      if (!endLabelBlocked(ly - offA)) endCy = ly - offA;
    }
    if (endCy === null) endCy = ly + 13;

    priceSvg.appendChild(textEl(endTx, endCy, endLabel, {
      fill: INK, size: "12px", weight: "600", anchor: "middle"
    }));

    [0, Math.floor((n - 1) / 2), n - 1].forEach(function (i) {
      var xx = xp(i);
      priceSvg.appendChild(svgEl("line", { x1: xx, y1: h - pad.b, x2: xx, y2: h - pad.b + 4, stroke: INK_SOFT, "stroke-width": "1" }));
      var lbl = fmtDate(win[i].date);
      var halfW = lbl.length * 2.6;
      var tx = Math.min(Math.max(xx, halfW + 2), w - halfW - 2);
      priceSvg.appendChild(textEl(tx, h - pad.b + 19, lbl, { anchor: "middle", size: "10px" }));
    });
  }

  var currentRange = 1;
  var priceData = null;

  function renderPrice() {
    if (priceData) drawPriceChart(priceData.rows, currentRange);
    if (fetchedEl) fetchedEl.textContent = (priceData && priceData.fetchedAt) || "–";
  }

  fetch("/assets/data/voo-history.json")
    .then(function (r) { return r.json(); })
    .then(function (d) {
      priceData = d;
      renderPrice();
    })
    .catch(function () {
      if (priceNote) priceNote.textContent = "Historické údaje sa nepodarilo načítať.";
    });

  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabs.forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      currentRange = Number(btn.getAttribute("data-range"));
      renderPrice();
    });
  });

  function drawFeeChart() {
    var w = 800, h = 320;
    var pad = { l: 68, r: 34, t: 34, b: 60 };
    var plotW = w - pad.l - pad.r;
    var plotH = h - pad.t - pad.b;

    clearSvg(feeSvg);
    feeSvg.setAttribute("width", w);
    feeSvg.setAttribute("height", h);

    var cheap = [], exp = [];
    for (var y = 0; y <= YEARS; y++) {
      cheap.push(futureValue(INITIAL, MONTHLY, y, GROSS - CHEAP_TER / 100));
      exp.push(futureValue(INITIAL, MONTHLY, y, GROSS - EXPENSIVE_TER / 100));
    }
    var maxV = Math.max.apply(null, cheap.concat(exp));
    var yMax = maxV * 1.08;

    function xp(y) { return pad.l + (y / YEARS) * plotW; }
    function yp(v) { return h - pad.b - (v / yMax) * plotH; }

    var fillPts = "";
    for (var y = 0; y <= YEARS; y++) fillPts += xp(y) + "," + yp(cheap[y]) + " ";
    for (var y = YEARS; y >= 0; y--) fillPts += xp(y) + "," + yp(exp[y]) + " ";
    feeSvg.appendChild(svgEl("polygon", { points: fillPts.trim(), fill: ORANGE_LIGHT, "fill-opacity": "0.18" }));

    var cheapPts = "", expPts = "";
    for (var y = 0; y <= YEARS; y++) {
      cheapPts += xp(y) + "," + yp(cheap[y]) + " ";
      expPts += xp(y) + "," + yp(exp[y]) + " ";
    }
    feeSvg.appendChild(svgEl("polyline", { points: expPts.trim(), fill: "none", stroke: ORANGE, "stroke-width": "2" }));
    feeSvg.appendChild(svgEl("polyline", { points: cheapPts.trim(), fill: "none", stroke: GREEN, "stroke-width": "2" }));

    feeSvg.appendChild(svgEl("circle", { cx: pad.l + 12, cy: pad.t - 12, r: 4, fill: GREEN }));
    feeSvg.appendChild(textEl(pad.l + 22, pad.t - 12, "Levné ETF (TER 0,03 %)", { size: "11px", fill: INK, weight: "600" }));
    feeSvg.appendChild(svgEl("circle", { cx: pad.l + 160, cy: pad.t - 12, r: 4, fill: ORANGE }));
    feeSvg.appendChild(textEl(pad.l + 170, pad.t - 12, "Průměrný fond (TER 0,41 %)", { size: "11px", fill: INK, weight: "600" }));

    for (var g = 0; g < 5; g++) {
      var vy = yMax * (g / 4);
      var yy = yp(vy);
      feeSvg.appendChild(svgEl("line", { x1: pad.l, y1: yy, x2: pad.l + plotW, y2: yy, stroke: GRID, "stroke-width": "1" }));
      feeSvg.appendChild(textEl(pad.l - 8, yy, czk(vy), { anchor: "end", size: "10px" }));
    }

    [0, 5, 10, 15, 20, 25].forEach(function (yr) {
      var xx = xp(yr);
      feeSvg.appendChild(svgEl("line", { x1: xx, y1: h - pad.b, x2: xx, y2: h - pad.b + 4, stroke: INK_SOFT, "stroke-width": "1" }));
      feeSvg.appendChild(textEl(xx, h - pad.b + 19, String(yr), { anchor: "middle", size: "10px" }));
    });

    var gap = exp[YEARS] - cheap[YEARS];
    feeSvg.appendChild(textEl(pad.l + plotW, h - pad.b + 40, "Modelový rozdíl po " + YEARS + " letech: " + czk(gap) + " Kč", { anchor: "end", size: "11px", fill: ORANGE, weight: "600" }));
  }

  function drawFeeCompactChart() {
    if (!feeCompactSvg) return;

    var w = 700, h = 180;
    var pad = { l: 55, r: 30, t: 10, b: 30 };
    var plotW = w - pad.l - pad.r;
    var plotH = h - pad.t - pad.b;

    clearSvg(feeCompactSvg);
    feeCompactSvg.setAttribute("width", w);
    feeCompactSvg.setAttribute("height", h);

    var cheap = [], exp = [];
    for (var y = 0; y <= YEARS; y++) {
      cheap.push(futureValue(INITIAL, MONTHLY, y, GROSS - CHEAP_TER / 100));
      exp.push(futureValue(INITIAL, MONTHLY, y, GROSS - EXPENSIVE_TER / 100));
    }
    var maxV = Math.max.apply(null, cheap.concat(exp));
    var yMax = maxV * 1.08;

    function xp(y) { return pad.l + (y / YEARS) * plotW; }
    function yp(v) { return h - pad.b - (v / yMax) * plotH; }

    var fillPts = "";
    for (var y = 0; y <= YEARS; y++) fillPts += xp(y) + "," + yp(cheap[y]) + " ";
    for (var y = YEARS; y >= 0; y--) fillPts += xp(y) + "," + yp(exp[y]) + " ";
    feeCompactSvg.appendChild(svgEl("polygon", { points: fillPts.trim(), fill: ORANGE_LIGHT, "fill-opacity": "0.15" }));

    var cheapPts = "", expPts = "";
    for (var y = 0; y <= YEARS; y++) {
      cheapPts += xp(y) + "," + yp(cheap[y]) + " ";
      expPts += xp(y) + "," + yp(exp[y]) + " ";
    }
    feeCompactSvg.appendChild(svgEl("polyline", { points: expPts.trim(), fill: "none", stroke: ORANGE, "stroke-width": "2" }));
    feeCompactSvg.appendChild(svgEl("polyline", { points: cheapPts.trim(), fill: "none", stroke: GREEN, "stroke-width": "2" }));

    feeCompactSvg.appendChild(svgEl("circle", { cx: pad.l + 12, cy: pad.t - 10, r: 3.5, fill: GREEN }));
    feeCompactSvg.appendChild(textEl(pad.l + 20, pad.t - 10, "Levné ETF (0,03 %)", { size: "10px", fill: INK, weight: "600" }));
    feeCompactSvg.appendChild(svgEl("circle", { cx: pad.l + 150, cy: pad.t - 10, r: 3.5, fill: ORANGE }));
    feeCompactSvg.appendChild(textEl(pad.l + 162, pad.t - 10, "Průměrný fond (0,41 %)", { size: "10px", fill: INK, weight: "600" }));

    for (var g = 0; g < 4; g++) {
      var vy = yMax * (g / 3);
      var yy = yp(vy);
      feeCompactSvg.appendChild(svgEl("line", { x1: pad.l, y1: yy, x2: pad.l + plotW, y2: yy, stroke: GRID, "stroke-width": "1" }));
      feeCompactSvg.appendChild(textEl(pad.l - 6, yy, czk(vy).replace(" Kč", ""), { anchor: "end", size: "9px" }));
    }

    [0, 10, 20, 25].forEach(function (yr) {
      var xx = xp(yr);
      feeCompactSvg.appendChild(svgEl("line", { x1: xx, y1: h - pad.b, x2: xx, y2: h - pad.b + 3, stroke: INK_SOFT, "stroke-width": "1" }));
      feeCompactSvg.appendChild(textEl(xx, h - pad.b + 14, String(yr), { anchor: "middle", size: "9px" }));
    });

    var gap = exp[YEARS] - cheap[YEARS];
    feeCompactSvg.appendChild(textEl(pad.l + plotW, h - pad.b + 32, "Rozdíl po 25 letech: " + czk(gap) + " Kč", { anchor: "end", size: "10px", fill: ORANGE, weight: "700" }));
  }

  function drawFeeHeroChart() {
    var heroSvg = document.getElementById("fee-hero-chart");
    if (!heroSvg) return;

    var w = 420, h = 260;
    var pad = { l: 56, r: 20, t: 26, b: 46 };
    var plotW = w - pad.l - pad.r;
    var plotH = h - pad.t - pad.b;

    clearSvg(heroSvg);
    heroSvg.setAttribute("width", w);
    heroSvg.setAttribute("height", h);

    var cheap = [], exp = [];
    for (var y = 0; y <= YEARS; y++) {
      cheap.push(futureValue(INITIAL, MONTHLY, y, GROSS - CHEAP_TER / 100));
      exp.push(futureValue(INITIAL, MONTHLY, y, GROSS - EXPENSIVE_TER / 100));
    }
    var maxV = Math.max.apply(null, cheap.concat(exp));
    var yMax = maxV * 1.08;

    function xp(y) { return pad.l + (y / YEARS) * plotW; }
    function yp(v) { return h - pad.b - (v / yMax) * plotH; }

    var fillPts = "";
    for (var y = 0; y <= YEARS; y++) fillPts += xp(y) + "," + yp(cheap[y]) + " ";
    for (var y = YEARS; y >= 0; y--) fillPts += xp(y) + "," + yp(exp[y]) + " ";
    heroSvg.appendChild(svgEl("polygon", { points: fillPts.trim(), fill: ORANGE_LIGHT, "fill-opacity": "0.15" }));

    var cheapPts = "", expPts = "";
    for (var y = 0; y <= YEARS; y++) {
      cheapPts += xp(y) + "," + yp(cheap[y]) + " ";
      expPts += xp(y) + "," + yp(exp[y]) + " ";
    }
    heroSvg.appendChild(svgEl("polyline", { points: expPts.trim(), fill: "none", stroke: ORANGE, "stroke-width": "2" }));
    heroSvg.appendChild(svgEl("polyline", { points: cheapPts.trim(), fill: "none", stroke: GREEN, "stroke-width": "2" }));

    heroSvg.appendChild(svgEl("circle", { cx: pad.l + 8, cy: pad.t - 12, r: 3, fill: GREEN }));
    heroSvg.appendChild(textEl(pad.l + 14, pad.t - 12, "Levné ETF (0,03 %)", { size: "10px", fill: INK, weight: "600" }));
    heroSvg.appendChild(svgEl("circle", { cx: pad.l + 118, cy: pad.t - 12, r: 3, fill: ORANGE }));
    heroSvg.appendChild(textEl(pad.l + 124, pad.t - 12, "Průměrný fond (0,41 %)", { size: "10px", fill: INK, weight: "600" }));

    for (var g = 0; g < 4; g++) {
      var vy = yMax * (g / 3);
      var yy = yp(vy);
      heroSvg.appendChild(svgEl("line", { x1: pad.l, y1: yy, x2: pad.l + plotW, y2: yy, stroke: GRID, "stroke-width": "1" }));
      heroSvg.appendChild(textEl(pad.l - 6, yy, czk(vy).replace(" Kč", ""), { anchor: "end", size: "9px" }));
    }

    [0, 10, 20, 25].forEach(function (yr) {
      var xx = xp(yr);
      heroSvg.appendChild(svgEl("line", { x1: xx, y1: h - pad.b, x2: xx, y2: h - pad.b + 3, stroke: INK_SOFT, "stroke-width": "1" }));
      heroSvg.appendChild(textEl(xx, h - pad.b + 14, String(yr), { anchor: "middle", size: "9px" }));
    });

    var gap = exp[YEARS] - cheap[YEARS];
    heroSvg.appendChild(textEl(pad.l + plotW, h - pad.b + 28, "Rozdiel: " + czk(gap) + " Kč", { anchor: "end", size: "10px", fill: ORANGE, weight: "700" }));
  }

  drawFeeChart();
  drawFeeCompactChart();
  drawFeeHeroChart();
})();
