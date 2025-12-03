# Deployment Workflow

This document describes the preview environment workflow for the Balanced Portfolio app.

## Overview

The app is deployed using **Vercel** with automatic preview deployments for all branches. This allows you to safely test changes before they reach production.

## Environments

### Production
- **Branch**: `main`
- **URL**: Your production Vercel URL
- **Deployment**: Automatic on push to `main`

### Preview
- **Branch**: Any branch except `main`
- **URL**: Unique preview URL per branch (provided by Vercel)
- **Deployment**: Automatic on push to any branch

## Workflow

### 1. Create a Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Your Changes

Edit code, test locally with `npm run dev`, and commit your changes:

```bash
git add .
git commit -m "Description of changes"
```

### 3. Push to GitHub

```bash
git push origin feature/your-feature-name
```

### 4. Test the Preview Deployment

- Vercel will automatically create a preview deployment
- Check your GitHub repo or Vercel dashboard for the preview URL
- The preview URL will look like: `balanced-app-xyz123.vercel.app`
- **Thoroughly test your changes** on the preview URL

### 5. Merge to Production

Once you've verified the preview works correctly:

```bash
# Switch back to main
git checkout main

# Merge your feature branch
git merge feature/your-feature-name

# Push to production
git push origin main
```

Vercel will automatically deploy the changes to production.

## Best Practices

### ✅ Do's
- **Always test preview deployments** before merging to `main`
- Use descriptive branch names (`feature/`, `fix/`, `refactor/`)
- Create a PR on GitHub to get the preview URL in the PR comments
- Keep preview branches short-lived

### ❌ Don'ts
- **Never force push to `main`** (use preview branches instead)
- Don't merge untested code to `main`
- Don't skip the preview step for "small" changes

## Rollback Strategy

If production breaks:

### Option 1: Revert via Git (Preferred)
```bash
# Find the last working commit
git log --oneline

# Revert to that commit
git revert <commit-hash>
git push origin main
```

### Option 2: Redeploy Previous Version via Vercel
1. Go to Vercel dashboard
2. Find the last working deployment
3. Click "Redeploy"

## Emergency Hotfix

For critical production bugs:

```bash
# Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-bug

# Make minimal fix
# ... edit files ...

# Test locally
npm run dev

# Push and test preview
git push origin hotfix/critical-bug

# After preview verification, merge to main
git checkout main
git merge hotfix/critical-bug
git push origin main
```

## Vercel Configuration

The `vercel.json` file configures:
- Build command and output directory
- SPA routing (all routes → `index.html`)
- Asset caching for performance
- Deployment settings

## Getting Preview URLs

### Via GitHub PR
1. Create a PR from your branch
2. Vercel bot will comment with the preview URL

### Via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. View all deployments and their URLs

### Via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview from current branch
vercel

# Get deployment URL
vercel ls
```

## Questions?

If you encounter issues with deployments, check:
1. Vercel dashboard for build logs
2. GitHub Actions (if configured)
3. `vercel.json` configuration
