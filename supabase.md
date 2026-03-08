# Supabase Setup Guide

This guide explains how to set up this project with Supabase PostgreSQL database and deploy to Vercel.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in with GitHub
3. Click "New Project"
4. Enter project name (e.g., "dev-bazaar")
5. Create a strong database password and save it
6. Choose a region close to your users
7. Wait for project to initialize (2-3 minutes)

## 2. Get Database Connection String

1. In Supabase dashboard, go to **Project Settings** → **Database**
2. Under "Connection string", find the **PostgreSQL** tab
3. Copy the connection string that looks like: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:[PORT]/postgres`
4. Replace `[YOUR-PASSWORD]` with your actual database password
5. Keep this safe - you'll use it for the DATABASE_URL environment variable

## 3. Create Tables in Supabase

Run this SQL in Supabase SQL Editor (top menu → SQL Editor → New Query):

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  domain TEXT,
  skills TEXT,
  linkedin TEXT,
  instagram TEXT,
  coins INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  is_open BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Marketplace items table
CREATE TABLE IF NOT EXISTS marketplace_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Premium content table
CREATE TABLE IF NOT EXISTS premium_content (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  cost INTEGER NOT NULL,
  author_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_projects_author_id ON projects(author_id);
CREATE INDEX idx_marketplace_items_author_id ON marketplace_items(author_id);
CREATE INDEX idx_premium_content_author_id ON premium_content(author_id);
CREATE INDEX idx_users_username ON users(username);
```

## 4. Prepare for Development (Local)

Install Drizzle ORM dependencies (if not already installed):

```bash
npm install drizzle-orm drizzle-kit pg
```

Update your `.env.local` file with:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[HOST]:[PORT]/postgres
SESSION_SECRET=your-secret-key-change-this
NODE_ENV=development
```

Run Drizzle migrations:

```bash
npm run db:push
```

## 5. Deploy to Vercel

### Step 1: Prepare Repository

1. Push your code to GitHub (your repository)
2. Ensure `.env.local` is in `.gitignore` (already is)

### Step 2: Create Vercel Account & Import Project

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Click "Import Project"
4. Select your GitHub repository
5. Click "Import"

### Step 3: Set Environment Variables in Vercel

In Vercel dashboard for your project:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres` | From Supabase (Step 2) |
| `SESSION_SECRET` | Generate a strong random string | Run: `openssl rand -base64 32` |
| `NODE_ENV` | `production` | For production environment |

3. Make sure all are set for "Production", "Preview", and "Development" environments
4. Click "Save"

### Step 4: Deploy

1. In Vercel dashboard, go to **Deployments**
2. Click "Deploy now"
3. Wait for build and deployment to complete
4. Your app will be live at `https://[your-project].vercel.app`

## 6. Test the Deployment

1. Visit your Vercel deployment URL
2. Try creating a user account (registration)
3. Try logging in
4. Browse the dashboard and other features
5. Check Vercel **Logs** tab if something breaks

## 7. Database Backups

Supabase automatically backs up your database daily. To manually backup:

1. In Supabase dashboard, go to **Backups**
2. Click "Request backup"
3. Backups are stored for 7 days (Pro plan) or 1 day (Free plan)

## 8. Troubleshooting

### Issue: "ECONNREFUSED" or connection errors

- Check DATABASE_URL is correct in Vercel environment variables
- Verify Supabase project is active (check in Supabase dashboard)
- Ensure your Supabase password doesn't have special characters or escape them properly

### Issue: "Relations do not exist" errors

- Run `npm run db:push` in your local development environment
- This syncs your Drizzle schema with the Supabase database
- Tables should auto-create from the schema

### Issue: Session not persisting

- Make sure `SESSION_SECRET` is set in environment variables (both local and Vercel)
- Check that PostgreSQL session table is created (Drizzle handles this automatically)

## 9. Environment Variables Summary

For **Development** (`.env.local`):
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
SESSION_SECRET=dev-secret-key
NODE_ENV=development
```

For **Production** (Vercel):
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
SESSION_SECRET=production-secret-key
NODE_ENV=production
```

## 10. Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use strong database password** - Supabase generates one; keep it secure
3. **Rotate SESSION_SECRET regularly** - Change the value in Vercel Settings
4. **Enable Row-Level Security (RLS)** in Supabase for sensitive data (optional)
5. **Monitor Supabase logs** - Check for suspicious queries
6. **Keep Drizzle updated** - Run `npm update` periodically

## 11. Scaling Considerations

- **Free tier**: 500 MB storage, 2 GB bandwidth
- **Pro tier**: More storage, backups, and uptime SLA
- Monitor usage in Supabase dashboard under **Usage**
- Upgrade when needed without downtime

## Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Vercel Docs](https://vercel.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
