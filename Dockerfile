### STAGE 1: Build ###
FROM node:20 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod
 
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/country-system/browser /usr/share/nginx/html
 
# Expose port 88
EXPOSE 42
 
# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]