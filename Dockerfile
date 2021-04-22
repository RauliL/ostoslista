FROM node:12

# Create volume for storing the data.
RUN mkdir /data
VOLUME ["/data"]

# Create application directory.
WORKDIR /usr/src/app

# Install application dependencies.
COPY package.json yarn.lock ./
RUN yarn install

# Bundle application sources.
COPY . .

# Transpile sources and static assets.
RUN yarn run build

ENV OSTOSLISTA_DATA="/data"

EXPOSE 3000

CMD ["yarn", "start"]
