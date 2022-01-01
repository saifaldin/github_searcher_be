FROM node:lts-alpine

WORKDIR github_searcher_be

COPY . .
RUN npm i typescript
RUN npm install --production
RUN npm run build
COPY dist .

EXPOSE 5000
ENTRYPOINT [ "node", "dist/server.js" ]
