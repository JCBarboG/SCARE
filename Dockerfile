# Imagen para desplegar el backend de SCARE (Express + scholarly) en
# Railway, Render, Fly.io o cualquier host que soporte Dockerfile.
# El frontend (Vite) se despliega aparte como sitio estático (Vercel/Netlify).
FROM node:18-slim

# Python3 + pip para el wrapper de scholarly
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

COPY api ./api

ENV PORT=3001
EXPOSE 3001

CMD ["node", "api/server.js"]
