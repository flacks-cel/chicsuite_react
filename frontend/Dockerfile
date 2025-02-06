FROM node:18-alpine
WORKDIR /app

# Copia package.json e package-lock.json primeiro
COPY package*.json ./

# Instala as dependências incluindo react-scripts
RUN npm install

# Copia o resto dos arquivos
COPY . .

# Adiciona o react-scripts explicitamente
RUN npm install react-scripts

# Define a porta
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "start"]