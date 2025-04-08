const express = require("express");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const multer = require("multer");
const markdownIt = require("markdown-it");
const markdownItContainer = require("markdown-it-container");
const puppeteer = require("puppeteer-core");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const md = markdownIt().use(markdownItContainer, "pagebreak", {
  render(tokens, idx) {
    return tokens[idx].nesting === 1
      ? '<div style="page-break-after: always;"></div>'
      : "";
  },
});

function convertMarkdownToHtml(markdown) {
  const htmlContent = md.render(markdown);
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 18px;
            padding: 20px;
          }
        </style>
      </head>
      <body>${htmlContent}</body>
    </html>
  `;
}

async function convertHtmlToPdf(html, outputPath) {
  const { executablePath } = require("puppeteer");
  const browser = await puppeteer.launch({
    executablePath: executablePath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({
    path: outputPath,
    format: "A4",
    margin: { top: "20mm", bottom: "20mm", left: "20mm", right: "20mm" },
  });
  await browser.close();
}

app.post("/convert", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const markdown = req.file.buffer.toString("utf-8");
  const html = convertMarkdownToHtml(markdown);
  const tempPdfPath = path.join(os.tmpdir(), `converted-${Date.now()}.pdf`);
  await convertHtmlToPdf(html, tempPdfPath);

  const pdfBuffer = await fs.readFile(tempPdfPath);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");
  res.send(pdfBuffer);
});

app.get("/", (_, res) => res.send("Markdown-to-PDF API is running!"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
