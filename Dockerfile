# build environment
FROM node:12.2.0-alpine as build

# 앱 디렉터리 생성
WORKDIR /usr/src/app

COPY . .

RUN apk --no-cache add tzdata && \
        cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
        echo "Asia/Seoul" > /etc/timezone

ENV REACT_APP_API_URL http://wp-reaction.master.10.52.181.241.nip.io
RUN cd ./wp_reaction_frontend && npm install --unsafe-perm && npm run build && mv build ../wp_reaction_api && cd ../wp_reaction_api && npm install --unsafe-perm

ENV NODE_ENV DEV
EXPOSE 8080

CMD cd ./wp_reaction_api && npm run start
