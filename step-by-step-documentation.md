
first step: create frontend and smart-contract directories

creating docker environment:
- create docker-compose.yml on root folder
- create frontend/Dockerfile 

- after having docker-compose and Dockerfile finished run: docker-compose up --build 
(--build for the first time or whenever a change is made in the Dockerfile)


frontend:
cd frontend
npm create vite@latest . -- --template react-ts
npm install




npx hardhat to init the project