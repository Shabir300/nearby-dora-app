FROM node:20-alpine AS builder

WORKDIR /app

# Force clean install for correct architecture
COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install --include=optional

COPY . .

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_GOOGLE_MAPS_API_KEY
ARG VITE_ONESIGNAL_APP_ID

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
ENV VITE_ONESIGNAL_APP_ID=$VITE_ONESIGNAL_APP_ID

RUN npm run build


# Stage 2 Serve with Nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config to support SPA routing (React Router etc)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
