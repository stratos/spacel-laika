FROM node:6.7.0-slim

RUN useradd -g daemon -m -d /tmp app \
  && mkdir /app \
  && chown app:daemon /app

USER app
WORKDIR /app

ADD npm-shrinkwrap.json /app/
ADD package.json /app/
RUN npm install --no-optional

ADD . /app

EXPOSE 8080
ENV PORT 8080

ENTRYPOINT ["npm", "start"]

