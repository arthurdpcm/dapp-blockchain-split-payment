FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8545

CMD ["npx", "hardhat", "node"]
# CMD ["npx", "hardhat", "compile"]
# CMD ["npx", "hardhat", "test"]