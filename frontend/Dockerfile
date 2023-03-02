FROM node:latest

WORKDIR /app/src

COPY frontend-src/ /app/src/

RUN	npm install axios && npm install && npm install --save-dev sass

EXPOSE 3000

ENTRYPOINT ["npm", "run", "dev"]