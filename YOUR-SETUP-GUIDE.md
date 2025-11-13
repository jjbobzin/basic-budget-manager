# Your Personalized Setup Guide

## 🎯 Ready-to-Run Commands

All commands below are customized for your accounts:
- **GitHub:** https://github.com/jjbobzin
- **Docker Hub:** https://app.docker.com/accounts/jjbobzin

Just copy and paste!

---

## 🚀 Quick Start: Push to GitHub

### Step 1: Extract and Initialize

```bash
# Extract the archive
tar -xzf budget-app-server.tar.gz
cd budget-app-server

# Initialize Git
git init

# Stage all files
git add .

# First commit
git commit -m "Initial commit: Budget Manager v2.0"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `budget-manager`
3. Description: `Personal budget management app with SQLite`
4. Visibility: **Public** (or Private if you prefer)
5. **Don't** check "Initialize with README" (we have files)
6. Click **Create repository**

### Step 3: Push to GitHub

```bash
# Connect to your GitHub repo
git remote add origin https://github.com/jjbobzin/budget-manager.git

# Verify remote was added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

**When prompted:**
- Username: `jjbobzin`
- Password: Use a **Personal Access Token** (not your password)

**To create a token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: `Budget Manager`
4. Select scope: `repo` (check the box)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

✅ **Done!** Your code is now at: https://github.com/jjbobzin/budget-manager

---

## 🐳 Option 1: Deploy to Unraid (Local Build)

### Quick Deployment

```bash
# SSH into Unraid
ssh root@YOUR_UNRAID_IP

# Navigate to appdata
cd /mnt/user/appdata

# Clone your repo
git clone https://github.com/jjbobzin/budget-manager.git

# Navigate into it
cd budget-manager

# Start the app
docker-compose up -d

# Check it's running
docker-compose ps

# View logs
docker-compose logs -f
```

**Access:** http://YOUR_UNRAID_IP:54321

### Update Later

```bash
# SSH into Unraid
cd /mnt/user/appdata/budget-manager

# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 🐳 Option 2: Deploy via Docker Hub (Faster Updates)

### Step 1: Build and Push to Docker Hub

**On your development machine:**

```bash
# Navigate to your app
cd budget-app-server

# Login to Docker Hub
docker login
# Username: jjbobzin
# Password: (your Docker Hub password)

# Build the image
docker build -t jjbobzin/budget-manager:latest .

# Tag with version (optional)
docker tag jjbobzin/budget-manager:latest jjbobzin/budget-manager:v2.0

# Push to Docker Hub
docker push jjbobzin/budget-manager:latest
docker push jjbobzin/budget-manager:v2.0
```

✅ **Done!** Your image is now at: https://hub.docker.com/r/jjbobzin/budget-manager

### Step 2: Deploy to Unraid from Docker Hub

```bash
# SSH into Unraid
ssh root@YOUR_UNRAID_IP

# Create directory
mkdir -p /mnt/user/appdata/budget-manager
cd /mnt/user/appdata/budget-manager

# Create docker-compose.hub.yml
cat > docker-compose.hub.yml << 'EOF'
version: '3.8'

services:
  budget-manager:
    container_name: budget-manager
    image: jjbobzin/budget-manager:latest
    ports:
      - "54321:54321"
    volumes:
      - ./data:/app/data
    environment:
      - PORT=54321
      - NODE_ENV=production
    restart: unless-stopped

volumes:
  data:
EOF

# Start the app
docker-compose -f docker-compose.hub.yml up -d

# Check it's running
docker-compose -f docker-compose.hub.yml ps
```

**Access:** http://YOUR_UNRAID_IP:54321

### Update Later (Fast!)

```bash
# On dev machine - build and push
cd budget-app-server
docker build -t jjbobzin/budget-manager:latest .
docker push jjbobzin/budget-manager:latest

# On Unraid - pull and restart (30 seconds!)
cd /mnt/user/appdata/budget-manager
docker-compose -f docker-compose.hub.yml pull
docker-compose -f docker-compose.hub.yml up -d
```

---

## 🔄 Making Changes Workflow

### On Your Dev Machine

```bash
# 1. Make changes to code
nano server.js  # or whatever file

# 2. Test locally
docker-compose build
docker-compose up -d
# Test at http://localhost:54321

# 3. Commit to Git
git add .
git commit -m "Fixed bug in calculation"
git push

# 4. If using Docker Hub, push new image
docker build -t jjbobzin/budget-manager:latest .
docker push jjbobzin/budget-manager:latest
```

### On Unraid

**If using local build:**
```bash
cd /mnt/user/appdata/budget-manager
git pull
docker-compose build --no-cache
docker-compose up -d
```

**If using Docker Hub:**
```bash
cd /mnt/user/appdata/budget-manager
docker-compose -f docker-compose.hub.yml pull
docker-compose -f docker-compose.hub.yml up -d
```

---

## 📊 What You Have

### On GitHub
- Repository: https://github.com/jjbobzin/budget-manager
- All your source code
- Version history via Git

### On Docker Hub (if you set it up)
- Repository: https://hub.docker.com/r/jjbobzin/budget-manager
- Pre-built Docker images
- Tagged versions (latest, v2.0, etc.)

### On Unraid
- Running app: http://YOUR_UNRAID_IP:54321
- Database: `/mnt/user/appdata/budget-manager/data/budget.db`

---

## 🎯 Recommended: Start Simple

**Day 1-2:** Use local build
```bash
# Just these commands
git clone https://github.com/jjbobzin/budget-manager.git
cd budget-manager
docker-compose up -d
```

**Later:** Add Docker Hub if you want faster updates
- Follow "Option 2" above
- Only takes 30-40 seconds to update vs 3 minutes

---

## 🆘 Troubleshooting

### "Authentication failed" when pushing to GitHub
**Solution:** Use a Personal Access Token, not your password
- Generate at: https://github.com/settings/tokens

### "Access denied" on Docker Hub
**Solution:** Make sure you're logged in
```bash
docker login
# Username: jjbobzin
```

### Can't access from network
**Solution:** Check firewall and port
- Verify port 54321 is accessible
- Test locally first: `curl http://localhost:54321`

---

## 📚 Files Already Configured

These files already have your username configured:

✅ **docker-compose.hub.yml** - Uses `jjbobzin/budget-manager:latest`
✅ **unraid-template.xml** - Configured for your repos
✅ All documentation references updated

You can use them as-is!

---

## ✅ Quick Checklist

**GitHub Setup:**
- [ ] Create repo at https://github.com/new
- [ ] Name it `budget-manager`
- [ ] `git init && git add . && git commit -m "Initial"`
- [ ] `git remote add origin https://github.com/jjbobzin/budget-manager.git`
- [ ] `git push -u origin main`

**Unraid Deployment (Local Build):**
- [ ] `git clone https://github.com/jjbobzin/budget-manager.git`
- [ ] `cd budget-manager`
- [ ] `docker-compose up -d`
- [ ] Access http://YOUR_UNRAID_IP:54321

**Docker Hub (Optional):**
- [ ] `docker login`
- [ ] `docker build -t jjbobzin/budget-manager:latest .`
- [ ] `docker push jjbobzin/budget-manager:latest`
- [ ] Use `docker-compose.hub.yml` on Unraid

---

## 🎉 You're Ready!

All commands above are ready to copy and paste. Your usernames are already configured throughout the app.

**Just run the commands and you're live!** 🚀

**Questions?** Check:
- WORKFLOW.md - Complete workflow guide
- DOCKER-HUB-GUIDE.md - Docker Hub details
- GITHUB.md - GitHub details
