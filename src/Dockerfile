# Build Phase
FROM node:8.9.1 as build-env
WORKDIR /app

# Copy dependency manifests
COPY ./gmg-app/package*.json ./gmg-app/
COPY ./gmg-client/package*.json ./gmg-client/
COPY ./gmg-server/package*.json ./gmg-server/

# Install dependencies and cache
RUN  npm i --prefix ./gmg-app && \
     npm i --prefix ./gmg-client && \
     npm i --prefix ./gmg-server

# Copy src
COPY ./gmg-app ./gmg-app
COPY ./gmg-client ./gmg-client
COPY ./gmg-server ./gmg-server

# Build Web
RUN npm run build --prefix ./gmg-app && \
    cp -R ./gmg-app/build ./gmg-server/public/app

# Execute app
FROM node:8.9.1 
COPY --from=build-env /app /app
WORKDIR /app/gmg-server
CMD ["npm", "run", "start:release"]
EXPOSE 80:80