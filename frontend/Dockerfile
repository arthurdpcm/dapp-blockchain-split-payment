
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# FROM node:20-alpine

# WORKDIR /app

# COPY package.json ./
# COPY package-lock.json ./
# RUN npm install

# COPY . .
# RUN npm run build

# EXPOSE 4173
# CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
