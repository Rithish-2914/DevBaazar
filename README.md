# Dev Bazaar

A community platform for students to connect, share projects, collaborate, and build together.

## Features

- **User Accounts**: Create profiles with domain, skills, LinkedIn, and Instagram
- **Dashboard**: View active projects, community members, and coin balance
- **Community**: Discover talented developers
- **Marketplace**: Buy and sell items or seek resources
- **Premium Content**: Access exclusive tutorials and guides
- **Projects**: Post projects and find collaborators

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with Express Session
- **Deployment**: Vercel (frontend + backend)

## Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Push database schema
npm run db:push

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5000`

## Deployment to Vercel

### Prerequisites
- Vercel account
- PostgreSQL database (Vercel Postgres, Supabase, or external)
- Repository on GitHub

### Steps

1. **Push your code to GitHub**

2. **Create a Vercel project**
   - Go to vercel.com and import your repository
   - Select the root directory

3. **Set environment variables in Vercel**
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A random secret key for sessions
   - `NODE_ENV`: Set to `production`

4. **Deploy**
   - Vercel will automatically build and deploy
   - The app runs as a serverless function with the Vite dev server for the frontend

## Database

The app uses PostgreSQL with Drizzle ORM. Tables include:
- `users`: User accounts and profiles
- `projects`: Community projects open for collaboration
- `marketplace_items`: Items for sale or requests
- `premium_content`: Paid tutorials and guides
- `session`: Session storage

## Architecture

- All API routes are in `/api/*`
- Frontend is served statically in production
- Backend handles authentication via sessions
- Database queries use the storage layer pattern
- Tailwind CSS with CSS variables for theming

## License

MIT