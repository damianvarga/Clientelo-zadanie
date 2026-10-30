import fs from "node:fs";
import PDFDocument from "pdfkit";
import { buildReportContent } from "./report.js";

// Fonty sa načítavajú cez `new URL(..., import.meta.url)` – táto forma je
// staticky traceovateľná pre @vercel/nft, takže .ttf súbory skončia aj v lambda bundle.
const REGULAR = fs.readFileSync(new URL("../node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf", import.meta.url));
const BOLD = fs.readFileSync(new URL("../node_modules/dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf", import.meta.url));
const OBLIQUE = fs.readFileSync(new URL("../node_modules/dejavu-fonts-ttf/ttf/DejaVuSans-Oblique.ttf", import.meta.url));

const PAGE_MARGIN = 50;

function fmtDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("cs-CZ");
}

export function generateReportPdf(model) {
  return new Promise(function (resolve, reject) {
    const content = buildReportContent(model);
    const chunks = [];
    const doc = new PDFDocument({
      size: "A4",
      margin: PAGE_MARGIN,
      bufferPages: false,
      info: {
        Title: "Osobní report - ETF Clientelo.cz",
        Author: "ETF Clientelo.cz",
        Creator: "ETF Clientelo.cz",
        CreationDate: new Date(content.createdAt)
      }
    });

    doc.on("data", function (chunk) { chunks.push(chunk); });
    doc.on("end", function () { resolve(Buffer.concat(chunks)); });
    doc.on("error", reject);

    const pageWidth = doc.page.width - PAGE_MARGIN * 2;

    doc.registerFont("Body", REGULAR);
    doc.registerFont("BodyBold", BOLD);
    doc.registerFont("BodyItalic", OBLIQUE);

    doc.font("BodyBold").fontSize(20).text(content.title, { align: "center" });
    doc.moveDown(0.3);
    doc.font("Body").fontSize(10).text(content.subtitle, { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(9).text("Vypracováno: " + fmtDate(content.createdAt), { align: "center" });
    doc.moveDown(1.2);

    content.sections.forEach(function (section) {
      if (section.kind === "kv") renderKv(doc, section);
      if (section.kind === "table") renderTable(doc, section, pageWidth);
      if (section.kind === "list") renderList(doc, section);
      if (section.kind === "note") renderNote(doc, section);
    });

    doc.end();
  });
}

function sectionTitle(doc, title) {
  doc.moveDown(0.8);
  doc.font("BodyBold").fontSize(14).fillColor("#0F3D2E").text(title);
  doc.moveDown(0.4);
}

function renderKv(doc, section) {
  sectionTitle(doc, section.title);
  doc.font("Body").fontSize(10).fillColor("#1A1A1A");
  section.rows.forEach(function (row) {
    const isEmphasis = row[0] === "Koncová hodnota portfolia" ||
      row[0] === "Koncová hodnota vašeho portfolia" ||
      row[0] === "Čistý příjem ročně" ||
      row[0] === "Úspora s W-8BEN ročně";
    doc.font(isEmphasis ? "BodyBold" : "Body");
    doc.text(row[0] + ": " + row[1]);
    doc.moveDown(0.15);
  });
  doc.moveDown(0.6);
}

function renderTable(doc, section, pageWidth) {
  sectionTitle(doc, section.title);

  const colX = [0, 70, pageWidth - 110];
  const colW = [70, pageWidth - 180, 110];

  function row(values, bold) {
    const startY = doc.y;
    doc.font(bold ? "BodyBold" : "Body").fontSize(10);
    const height = Math.max(
      doc.heightOfString(values[0], { width: colW[0] - 10 }),
      doc.heightOfString(values[1], { width: colW[1] - 10 }),
      doc.heightOfString(values[2], { width: colW[2] - 10 })
    );
    if (startY + height > doc.page.height - PAGE_MARGIN) {
      doc.addPage();
    }
    const y = doc.y;
    doc.text(values[0], PAGE_MARGIN + colX[0], y, { width: colW[0] - 10 });
    doc.text(values[1], PAGE_MARGIN + colX[1], y, { width: colW[1] - 10 });
    doc.text(values[2], PAGE_MARGIN + colX[2], y, { width: colW[2], align: "right" });
    doc.y = Math.max(doc.y, y + height + 6);
  }

  row(section.headers, true);
  doc
    .moveTo(PAGE_MARGIN, doc.y)
    .lineTo(PAGE_MARGIN + pageWidth, doc.y)
    .strokeColor("#C9D4CE")
    .lineWidth(0.75)
    .stroke();
  doc.moveDown(0.3);

  section.rows.forEach(function (values) {
    row(values, false);
  });

  doc.moveDown(0.6);
}

function renderList(doc, section) {
  sectionTitle(doc, section.title);
  doc.font("Body").fontSize(10).fillColor("#1A1A1A");
  section.items.forEach(function (item, i) {
    doc.x = PAGE_MARGIN;
    doc.font("BodyBold").text((i + 1) + ". ", { continued: true }).font("Body").text(item, { align: "justify" });
    doc.moveDown(0.25);
  });
  doc.moveDown(0.6);
}

function renderNote(doc, section) {
  doc.moveDown(1);
  doc
    .font("BodyItalic")
    .fontSize(8.5)
    .fillColor("#4A4A4A")
    .text(section.text, { align: "justify" });
  doc.moveDown(0.5);
}
