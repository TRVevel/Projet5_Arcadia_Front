# Étape 1 : Compilation de l'application Angular
FROM node:22-alpine AS builder
WORKDIR /app
# Copie des fichiers de configuration et installation des dépendances
COPY package*.json ./
RUN npm ci
# Copie du reste du code source
COPY . .
# Compilation de l'application en mode production
RUN npm run build -- --configuration production
# Étape 2 : Mise en production avec Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/projet-angular/browser /usr/share/nginx/html
# Exposition du port 80
EXPOSE 80
# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]