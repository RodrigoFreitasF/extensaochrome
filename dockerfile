FROM mcr.microsoft.com/playwright:v1.56.0-jammy

WORKDIR /app
COPY package*.jason ./
RUN npm ci --silent

#garantir navegadores/deps
RUN npx playwright install --with-deps chromium

COPY . .

# build da extensão
RUN npm run build 

# Rodar os testes
CMD ["npm", "test"]

