import PDFDocument from "pdfkit";
import fs from "node:fs";

const PAGE_MARGIN = 50;
const REGULAR = fs.readFileSync("C:/Users/BigON/Desktop/kopiaClientelo/Clientelo-zadanie/node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf");
const BOLD = fs.readFileSync("C:/Users/BigON/Desktop/kopiaClientelo/Clientelo-zadanie/node_modules/dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf");

const doc = new PDFDocument({ size: "A4", margin: PAGE_MARGIN, bufferPages: false });
doc.registerFont("Body", REGULAR);
doc.registerFont("BodyBold", BOLD);

const pageWidth = doc.page.width - PAGE_MARGIN * 2;

function sectionTitle(doc, title) {
  doc.moveDown(0.8);
  doc.font("BodyBold").fontSize(14).fillColor("#0F3D2E").text(title);
  doc.moveDown(0.4);
}

// Simulate renderTable ending with right-aligned column
doc.font("BodyBold").fontSize(14).text("Porovnání šesti ETF");
doc.moveDown(0.4);
doc.font("Body").fontSize(10);
doc.text("ETF", PAGE_MARGIN + 0, doc.y, { width: 60 });
doc.text("Sledovaný index", PAGE_MARGIN + 70, doc.y, { width: pageWidth - 180 });
doc.text("TER %", PAGE_MARGIN + pageWidth - 110, doc.y, { width: 110, align: "right" });
doc.y = doc.y + 20;
console.log("AFTER TABLE x=", doc.x, "y=", doc.y);

// Now renderList
function renderList(doc, section) {
  sectionTitle(doc, section.title);
  doc.font("Body").fontSize(10).fillColor("#1A1A1A");
  section.items.forEach(function (item, i) {
    console.log("BEFORE item", i, "x=", doc.x, "y=", doc.y);
    doc.font("BodyBold").text((i + 1) + ". ", { continued: true }).font("Body").text(item);
    console.log("AFTER item", i, "x=", doc.x, "y=", doc.y);
    doc.moveDown(0.25);
  });
}

renderList(doc, { title: "Checklist prvních kroků", items: [
  "Otevřete si účet u brokera s přístupem na NYSE (např. Fio, Trading 212, DEGIRO nebo Interactive Brokers)."
]});

doc.end();
console.log("done");
