#!/bin/bash

PROJECT_ID=$(gcloud config get-value project)

gcloud builds submit --tag gcr.io/$PROJECT_ID/markdown-to-pdf
gcloud run deploy markdown-to-pdf \
  --image gcr.io/$PROJECT_ID/markdown-to-pdf \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
