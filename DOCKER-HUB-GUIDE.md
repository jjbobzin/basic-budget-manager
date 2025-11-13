# Docker Deployment: Local Build vs Docker Hub

## Two Approaches Explained

### Approach 1: Local Build (What You Have Now)

**docker-compose.yml:**
```yaml
services:
  budget-manager:
    build: .                      # ← Builds from source code
    image: budget-manager:latest
```

**How it works:**
1. You have source code on your server (from Git clone)
2. Docker reads `Dockerfile`
3. Docker builds the image locally
4. Container runs from locally-built image

**Pros:**
- ✅ No Docker Hub account needed
- ✅ Complete control over build
- ✅ Can make local modifications
- ✅ Good for development

**Cons:**
- ❌ Slower initial deployment (builds on server)
- ❌ Requires source code on server
- ❌ Must rebuild after code changes
- ❌ Each server builds separately

**When to use:**
- You're actively developing
- Single server deployment
- Don't want to set up Docker Hub
- Making frequent changes

---

### Approach 2: Docker Hub (What You've Seen)

**docker-compose.hub.yml:**
```yaml
services:
  budget-manager:
    image: yourusername/budget-manager:latest  # ← Pulls pre-built image
```

**How it works:**
1. You build image on your dev machine
2. You push image to Docker Hub
3. Server downloads pre-built image
4. Container runs immediately

**Pros:**
- ✅ Fast deployment (no building on server)
- ✅ No source code needed on server
- ✅ Version control (tags: v1.0, v2.0, latest)
- ✅ Easy updates (just pull new image)
- ✅ Share with others easily
- ✅ Multiple servers pull same image

**Cons:**
- ❌ Requires Docker Hub account
- ❌ Extra step to publish
- ❌ Public repo visible to all (unless paid)

**When to use:**
- Production deployment
- Multiple servers
- Sharing with others
- Want fast updates
- Professional workflow

---

## Comparison Table

| Feature | Local Build | Docker Hub |
|---------|-------------|------------|
| **Speed first deploy** | Slow (builds) | Fast (downloads) |
| **Speed to update** | Slow (rebuild) | Fast (pull) |
| **Requires source** | Yes | No |
| **Requires Docker Hub** | No | Yes |
| **Easy sharing** | No | Yes |
| **Version control** | Via Git | Via tags |
| **Disk space** | Source + image | Just image |
| **Build time** | On every server | Once, on dev machine |

---

## Setting Up Docker Hub (Step-by-Step)

### Step 1: Create Docker Hub Account

1. Go to [hub.docker.com](https://hub.docker.com)
2. Sign up (free for public repos)
3. Verify email

### Step 2: Create Repository

1. Click **Create Repository**
2. Name: `budget-manager`
3. Visibility: Public (free) or Private (paid)
4. Description: "Personal budget management app"
5. Click **Create**

**Your repo URL will be:**
`https://hub.docker.com/r/yourusername/budget-manager`

### Step 3: Login on Your Dev Machine

```bash
docker login
# Enter username
# Enter password (or Personal Access Token)
```

### Step 4: Build and Tag Image

```bash
# Navigate to your app directory
cd budget-app-server

# Build and tag in one command
docker build -t yourusername/budget-manager:latest .

# Or build first, then tag
docker build -t budget-manager:latest .
docker tag budget-manager:latest yourusername/budget-manager:latest
```

**Understanding tags:**
- `yourusername` - Your Docker Hub username
- `budget-manager` - Repository name
- `latest` - Tag (version)

**Example with versions:**
```bash
docker tag budget-manager:latest yourusername/budget-manager:v2.0
docker tag budget-manager:latest yourusername/budget-manager:latest
```

### Step 5: Push to Docker Hub

```bash
docker push yourusername/budget-manager:latest

# If you tagged versions:
docker push yourusername/budget-manager:v2.0
docker push yourusername/budget-manager:latest
```

**This uploads the image to Docker Hub.**

### Step 6: Deploy on Unraid

**Option A: Using docker-compose.hub.yml:**
```bash
# SSH to Unraid
ssh root@unraid-ip

# Create directory (if not exists)
mkdir -p /mnt/user/appdata/budget-manager
cd /mnt/user/appdata/budget-manager

# Download just the docker-compose file (no source code needed!)
wget https://raw.githubusercontent.com/YOUR_USERNAME/budget-manager/main/docker-compose.hub.yml
# Or copy it manually

# Edit and replace 'yourusername' with your actual username
nano docker-compose.hub.yml

# Deploy
docker-compose -f docker-compose.hub.yml up -d
```

**Option B: Using Unraid Docker template:**
```
Repository: yourusername/budget-manager:latest
Port: 54321:54321
Volume: /mnt/user/appdata/budget-manager/data:/app/data
```

---

## Complete Workflow: GitHub + Docker Hub

### Initial Setup (Once)

**1. Push code to GitHub:**
```bash
cd budget-app-server
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOU/budget-manager.git
git push -u origin main
```

**2. Build and push to Docker Hub:**
```bash
docker login
docker build -t yourusername/budget-manager:latest .
docker push yourusername/budget-manager:latest
```

**3. Deploy to Unraid:**
```bash
ssh root@unraid-ip
mkdir -p /mnt/user/appdata/budget-manager/data
cd /mnt/user/appdata/budget-manager

# Create docker-compose.hub.yml (copy from GitHub or manually)
nano docker-compose.hub.yml
# Paste content, update 'yourusername'

docker-compose -f docker-compose.hub.yml up -d
```

### Making Updates

**On dev machine:**
```bash
# 1. Make code changes
nano server.js

# 2. Commit to Git
git add .
git commit -m "Added new feature"
git push

# 3. Build new Docker image
docker build -t yourusername/budget-manager:latest .

# 4. Tag with version (optional)
docker tag yourusername/budget-manager:latest yourusername/budget-manager:v2.1

# 5. Push to Docker Hub
docker push yourusername/budget-manager:latest
docker push yourusername/budget-manager:v2.1  # if tagged
```

**On Unraid:**
```bash
ssh root@unraid-ip
cd /mnt/user/appdata/budget-manager

# Pull new image
docker-compose -f docker-compose.hub.yml pull

# Restart with new image
docker-compose -f docker-compose.hub.yml up -d
```

**That's it!** No rebuilding on Unraid, just download and restart.

---

## Which Approach Should You Use?

### Use Local Build If:
- You're the only user
- Single Unraid server
- Making frequent changes
- Don't want Docker Hub hassle
- Learning/experimenting

**Use:** `docker-compose.yml` (current file)

### Use Docker Hub If:
- Multiple servers
- Sharing with others
- Want professional workflow
- Fast deployments important
- Infrequent changes

**Use:** `docker-compose.hub.yml` (new file)

### Use Both If:
- Dev machine: Local build for testing
- Production: Docker Hub for deployment

---

## Hybrid Approach (Recommended)

**Development machine:**
```bash
# Use local build for fast iteration
docker-compose up -d
# Make changes
docker-compose build
docker-compose up -d
```

**When ready to deploy:**
```bash
# Push to GitHub
git push

# Build and push to Docker Hub
docker build -t yourusername/budget-manager:v2.1 .
docker push yourusername/budget-manager:v2.1
docker tag yourusername/budget-manager:v2.1 yourusername/budget-manager:latest
docker push yourusername/budget-manager:latest
```

**Unraid server:**
```bash
# Pull from Docker Hub (fast!)
docker-compose -f docker-compose.hub.yml pull
docker-compose -f docker-compose.hub.yml up -d
```

---

## Docker Hub Advanced: Automated Builds

You can connect Docker Hub to GitHub for automatic builds:

### Setup Auto-Build

1. Go to your Docker Hub repository
2. Click **Builds** tab
3. Click **Configure Automated Builds**
4. Link to GitHub
5. Select your `budget-manager` repo
6. Configure:
   - Source: `main` branch
   - Dockerfile: `Dockerfile`
   - Tag: `latest`
7. Save

**Now:** Every time you push to GitHub, Docker Hub automatically builds a new image!

**Workflow becomes:**
```bash
# Development
git add .
git commit -m "New feature"
git push
# Docker Hub automatically builds new image

# On Unraid (15 minutes later)
docker-compose -f docker-compose.hub.yml pull
docker-compose -f docker-compose.hub.yml up -d
```

---

## GitHub Actions: Even More Automation

Create `.github/workflows/docker-publish.yml`:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: yourusername/budget-manager:latest
```

**Setup:**
1. Add secrets to GitHub repo:
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
2. Push this file to GitHub

**Now:** Push to GitHub → Automatic Docker build → Image on Docker Hub

---

## Practical Example

### Current Setup (Local Build)

```bash
# Unraid
ssh root@unraid-ip
cd /mnt/user/appdata
git clone https://github.com/YOU/budget-manager.git
cd budget-manager
docker-compose up -d              # Takes 2-3 minutes to build

# Update later
git pull
docker-compose build --no-cache   # Takes 2-3 minutes to rebuild
docker-compose up -d
```

### Docker Hub Setup

```bash
# Dev machine (once)
docker build -t yourusername/budget-manager:latest .
docker push yourusername/budget-manager:latest

# Unraid (first time)
ssh root@unraid-ip
mkdir -p /mnt/user/appdata/budget-manager
cd /mnt/user/appdata/budget-manager
# Copy docker-compose.hub.yml
docker-compose -f docker-compose.hub.yml up -d  # Takes 30 seconds to download

# Update later (fast!)
docker-compose -f docker-compose.hub.yml pull   # 10 seconds
docker-compose -f docker-compose.hub.yml up -d  # 5 seconds
```

---

## File Structure Comparison

### With Local Build
```
/mnt/user/appdata/budget-manager/
├── server.js              # Need source code
├── database.js            # Need source code
├── package.json           # Need source code
├── public/                # Need source code
├── Dockerfile             # Need Dockerfile
├── docker-compose.yml     # Need compose file
└── data/                  # Database
    └── budget.db
```

### With Docker Hub
```
/mnt/user/appdata/budget-manager/
├── docker-compose.hub.yml # Only need compose file!
└── data/                  # Database
    └── budget.db
```

Much cleaner on production server!

---

## Commands Reference

### Local Build
```bash
docker-compose up -d                    # Build and start
docker-compose down                     # Stop
docker-compose build --no-cache         # Rebuild
docker-compose logs -f                  # View logs
```

### Docker Hub
```bash
# Build and push (dev machine)
docker build -t user/app:latest .
docker push user/app:latest

# Pull and run (server)
docker-compose -f docker-compose.hub.yml pull
docker-compose -f docker-compose.hub.yml up -d
docker-compose -f docker-compose.hub.yml logs -f
docker-compose -f docker-compose.hub.yml down
```

---

## Recommendation for Your Use Case

**Start with Local Build** (what you have now):
- Simpler to understand
- No Docker Hub setup needed
- Good for learning

**Graduate to Docker Hub** when:
- You're comfortable with the workflow
- Want faster Unraid updates
- Planning to share with others
- Have multiple deployments

---

## Summary

**Your question:** "How does docker-compose.yml pull from Git?"

**Answer:** It doesn't! Two separate things:

1. **Git**: Stores source code
   ```bash
   git clone https://github.com/YOU/budget-manager.git
   ```

2. **Docker Compose**: Either builds locally OR pulls from Docker Hub
   ```yaml
   build: .                              # Local build
   # OR
   image: username/budget-manager:latest # Docker Hub pull
   ```

**The workflow:**
```
Code (Git) → Build (Docker) → Run (Container)
     ↓            ↓               ↓
   GitHub    Docker Hub       Unraid

Option A: Git → Build on Unraid → Run
Option B: Git → Build on dev → Push to Hub → Pull on Unraid → Run
```

You've been doing Option A. Option B is more professional but requires Docker Hub setup.

Both are valid! Choose based on your needs. 🚀
