import { getRedis, loadReport, isValidReportId } from "../lib/store.js";
import { generateReportPdf } from "../lib/report-pdf.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });

  let id = req.query?.id;
  if (typeof id !== "string" || !isValidReportId(id.toLowerCase())) {
    return res.status(400).json({ error: "invalid_id" });
  }
  id = id.toLowerCase();

  const redis = getRedis();
  if (!redis) return res.status(503).json({ error: "db_not_configured" });

  let entry;
  try {
    entry = await loadReport(redis, id);
  } catch (err) {
    console.error("[report] db_error", String((err && err.message) || err).slice(0, 300));
    return res.status(503).json({ error: "db_unavailable" });
  }
  if (!entry) return res.status(404).json({ error: "not_found" });

  try {
    let pdfBuffer = null;
    if (typeof entry.pdfBase64 === "string" && entry.pdfBase64) {
      pdfBuffer = Buffer.from(entry.pdfBase64, "base64");
    } else if (entry.model && typeof entry.model === "object") {
      pdfBuffer = await generateReportPdf(entry.model);
    }
    if (!pdfBuffer || !pdfBuffer.length) return res.status(404).json({ error: "not_found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="ETF_osobni_report.pdf"');
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error("[report] pdf_error", String((err && err.message) || err).slice(0, 300));
    return res.status(500).json({ error: "pdf_failed" });
  }
}
