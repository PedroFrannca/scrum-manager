# Imagem base
FROM node:18

# Diretório de trabalho no contêiner
WORKDIR /app

# Copiando o package.json e instalando as dependências
COPY package*.json ./
RUN npm install

# Copiando o restante do código da aplicação
COPY . .

# Instalando o nodemon globalmente no contêiner
RUN npm install -g nodemon

# Expondo a porta da aplicação
EXPOSE 3000

# Comando para iniciar o servidor com nodemon
CMD ["node", "server.js"]
