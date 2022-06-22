FROM node:alpine
WORKDIR /app
COPY ./ ./
RUN npm i && cd client && npm i && npm i concurrently -g
CMD ["npm", "run", "dev"]