# Personal Website

Personal website built with Next.js, Material-UI, and Tailwind CSS.

![Screenshot](./public/screenshot.png)

## Tech Stack

- Next.js with App Router
- React
- Material-UI (MUI)
- Tailwind CSS
- TypeScript
- Three.js (for 3D)

## Development

### Prerequisites

- Node.js 24+
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables (optional):

```bash
cp .env.example .env
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Useful Commands

- `npm run type-check` - TypeScript type checking
- `npm run lint` - Code linting with Biome
- `npm run build` - Production build
- `npm run start` - Run production build

## Production

### Without Docker

1. Build the project:

```bash
npm run build
```

2. Start the server:

```bash
npm run start
```

### With Docker

#### Build Image

```bash
docker build -t personal-website .
```

#### Using Docker Compose

1. Copy the example file:

```bash
cp compose.yml.example compose.yml
```

2. Edit `compose.yml` with your domains and settings
3. Create Caddy network (if not exists):

```bash
docker network create caddy_net
```

4. Start containers:

```bash
docker compose up -d
```

## Deploy with Caddy

The project is configured to work with Caddy through Docker Compose labels:

- Automatic HTTPS configuration
- Compression with zstd and gzip
- Reverse proxy to port 3000

### Example Configuration

In `compose.yml`, configure the labels:

```yaml
labels:
  - caddy=your-domain.com, www.your-domain.com
  - caddy.reverse_proxy={{upstreams 3000}}
  - caddy.encode=zstd gzip
```

## Screenshots

The project includes automated screenshot generation for README and OpenGraph meta tags:

- `public/screenshot.png` (1280x1024) - README display
- `public/og-image.png` (1200x630) - Social media sharing

To update screenshots:

```bash
npm run update-screenshot
```

To customize the domain name shown in the header:

```bash
SITE_DOMAIN=trve npm run update-screenshot
```

This runs a Docker container with Puppeteer that captures and compresses the images. Requires Docker.

## Project Structure

```
.
├── app/          # App Router (Next.js)
├── public/       # Static files (including screenshots)
├── components/   # React components
├── content/      # Markdown content
├── lib/          # Utilities
└── scripts/      # Automation scripts
```

## Available Scripts

- `dev` - Development server with Turbopack
- `build` - Production build with type checking
- `start` - Production server
- `type-check` - TypeScript checking
- `lint` - Linting with Biome
- `update-screenshot` - Update README and OpenGraph screenshots using Docker
