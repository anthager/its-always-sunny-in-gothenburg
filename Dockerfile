FROM node:14-stretch

WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . ./

RUN yarn build

CMD [ "yarn", "start" ]

