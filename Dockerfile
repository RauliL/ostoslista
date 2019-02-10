FROM node:10.15.1-alpine
ADD . /code
WORKDIR /code
RUN npm install
RUN npm run build
CMD ["npm", "start"]
