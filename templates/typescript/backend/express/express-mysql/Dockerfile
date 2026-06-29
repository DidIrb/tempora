FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN pnpm prisma generate

# Copy source code
COPY . .

EXPOSE 3000

# Run dev server (swap for build+start in production)
CMD ["pnpm", "dev"]
