# Quick Deployment Guide: Supabase + Vercel

This is a quick reference for deploying your app to Vercel with Supabase.

## 🚀 Quick Start (5 minutes)

### 1. Create Supabase Project (2 min)
1. Visit [supabase.com](https://supabase.com) → New Project
2. Save the database password
3. Once created, go to **Settings → Database → Connection Strings**
4. Copy the PostgreSQL connection string

### 2. Create Tables in Supabase (1 min)
In Supabase Dashboard: **SQL Editor → New Query**

Paste all SQL from `supabase.md` section 3 and run it.

### 3. Push Code to GitHub
```bash
git add .
git commit -m "Add Supabase support"
git push origin main
```

### 4. Deploy to Vercel (2 min)
1. Go to [vercel.com](https://vercel.com) → Import Project
2. Select your GitHub repository
3. Go to **Settings → Environment Variables** and add:
   - `DATABASE_URL`: Your Supabase connection string
   - `SESSION_SECRET`: Generate with `openssl rand -base64 32`
   - `NODE_ENV`: `production`
4. Click "Deploy"

## 📋 Environment Variables Needed

| Variable | Source | Example |
|----------|--------|---------|
| `DATABASE_URL` | Supabase → Settings → Database → Connection Strings (PostgreSQL) | `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres` |
| `SESSION_SECRET` | Generate new | `dGhpcyBpcyBhIHNlY3JldCBrZXk=` |
| `NODE_ENV` | Set value | `production` |

## 🔗 Useful Links
- **Supabase Connection Strings**: https://supabase.com/docs/guides/database/connecting-to-postgres
- **Vercel Environment Variables**: https://vercel.com/docs/projects/environment-variables
- **Full Setup Guide**: See `supabase.md` in project root

## ❌ Common Issues & Fixes

**"Can't connect to database"**
- Verify DATABASE_URL is correct in Vercel Settings
- Check Supabase project is active
- Test connection locally with `.env.local` first

**"Sessions not working"**
- Ensure SESSION_SECRET is set in Vercel Environment Variables
- Must be set for Production, Preview, and Development environments

**"Tables don't exist"**
- Run SQL from `supabase.md` section 3 in Supabase SQL Editor
- Or: Use Drizzle: `npm run db:push`

## ✅ Verify Deployment
1. Visit your Vercel domain (e.g., `https://myapp.vercel.app`)
2. Register a new account
3. Check that you can log in
4. Verify data persists (log out and back in)

## 🔐 Security Checklist
- [ ] DATABASE_URL uses strong Supabase password
- [ ] SESSION_SECRET is a random 32+ character string
- [ ] Never commit `.env.local` to GitHub (already in `.gitignore`)
- [ ] Use different SESSION_SECRET for production
- [ ] Enable Row-Level Security (RLS) in Supabase if handling sensitive data

## 📖 For Detailed Setup
See `supabase.md` in the project root for complete step-by-step instructions.
