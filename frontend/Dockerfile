FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies only when needed
COPY package*.json ./
RUN npm install
RUN npm install -D tailwindcss postcss autoprefixer

# Set development environment
ENV NODE_ENV=development

# Add non-root user for better security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs \
    && chown -R nextjs:nodejs /usr/src/app

# Create and set permissions for .next directory
RUN mkdir .next \
    && chown -R nextjs:nodejs .next \
    && chmod 777 .next

# Create and set permissions for cache directory
RUN mkdir -p .next/cache \
    && chown -R nextjs:nodejs .next/cache \
    && chmod 777 .next/cache

USER nextjs

EXPOSE 3000

# Clean webpack cache before starting
CMD rm -rf .next/cache/webpack && npm run dev