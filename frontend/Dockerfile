FROM node:latest

WORKDIR /app/src

COPY frontend-src/ /app/src/

RUN	npm install axios && npm install && npm install --save-dev sass && npm i --save @fortawesome/fontawesome-svg-core && npm i --save @fortawesome/free-solid-svg-icons && npm i --save @fortawesome/free-regular-svg-icons && npm i --save @fortawesome/free-brands-svg-icons

EXPOSE 3000

ENTRYPOINT ["npm", "run", "dev"]