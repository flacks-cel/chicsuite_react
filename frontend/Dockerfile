FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./
COPY public/ ./public/
COPY src/ ./src/
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Instala as dependências
RUN npm install

# Define a porta
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "start"]