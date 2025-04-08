# Markdown to PDF API

This is a Node.js + Puppeteer + Express app that converts uploaded Markdown files to PDF using headless Chrome.

## How to Deploy (Cloud Run)

### 1. Create a new GCP project and enable billing

### 2. Enable APIs

- Cloud Run
- Cloud Build
- Container Registry

### 3. Build and deploy

gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/markdown-to-pdf gcloud run deploy markdown-to-pdf
--image gcr.io/YOUR_PROJECT_ID/markdown-to-pdf
--platform managed
--region us-central1
--allow-unauthenticated
--port 3000

### 4. Use

POST a file to `/convert`:

curl -X POST -F "file=@example.md" https://your-service-url.a.run.app/convert --output output.pdf
