FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Em desenvolvimento, usamos npm run dev
# Para produção, você usaria: RUN npm run build && CMD ["npm", "start"]
CMD ["npm", "run", "dev"]
