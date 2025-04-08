FROM mcr.microsoft.com/playwright:v1.43.1-focal

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
