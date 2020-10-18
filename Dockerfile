FROM node:12 as client
WORKDIR /client
COPY /client .
RUN yarn
RUN yarn build

FROM node:12 as server
WORKDIR /server
COPY /server .
COPY --from=client /client/build ./build
RUN yarn i
EXPOSE 3001
CMD ["yarn", "start"]