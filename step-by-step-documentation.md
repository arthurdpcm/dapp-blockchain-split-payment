
first step: create frontend and smart-contract directories

frontend:
cd frontend
npm create vite@latest . -- --template react-ts
npm install

creating docker environment:
- create docker-compose.yml on root folder
- create frontend/Dockerfile 

- after having docker-compose and Dockerfile finished run: docker-compose up --build 
(--build for the first time or whenever a change is made in the Dockerfile)


creating smart-contract:
npm init -y
npm install --save-dev hardhat
npx hardhat 

(Initializing a project with npx hardhat is deprecated and will be removed in the future.
 Please use npx hardhat init instead.)