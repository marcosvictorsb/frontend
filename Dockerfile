FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# Copiar o restante do código
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
