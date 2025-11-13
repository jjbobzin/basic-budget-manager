# Docker Deployment: Visual Comparison

## Approach 1: Local Build (Current Setup)

```
┌─────────────────────────────────────────────────────┐
│ Development Machine                                 │
│                                                     │
│  1. Write code                                      │
│  2. git push to GitHub                              │
│                                                     │
│     ┌──────────────────────────────────────┐       │
│     │  GitHub                              │       │
│     │  - Stores source code                │       │
│     │  - Version control                   │       │
│     └──────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
                         ↓
                         ↓ git clone
                         ↓
┌─────────────────────────────────────────────────────┐
│ Unraid Server                                       │
│                                                     │
│  1. git clone https://github.com/YOU/budget.git    │
│     └─→ Downloads all source code                  │
│                                                     │
│  2. docker-compose up -d                            │
│     └─→ Reads Dockerfile                           │
│     └─→ Builds image locally (2-3 min)             │
│     └─→ Runs container                             │
│                                                     │
│  Data: /mnt/user/appdata/budget-manager/           │
│  ├── server.js        ← Source files               │
│  ├── database.js      ← Source files               │
│  ├── package.json     ← Source files               │
│  ├── Dockerfile       ← Build instructions         │
│  └── data/budget.db   ← Your database              │
└─────────────────────────────────────────────────────┘

PROS: Simple, no Docker Hub needed
CONS: Slow builds, requires source code on server
```

---

## Approach 2: Docker Hub (Professional Setup)

```
┌─────────────────────────────────────────────────────┐
│ Development Machine                                 │
│                                                     │
│  1. Write code                                      │
│  2. git push to GitHub                              │
│                                                     │
│     ┌──────────────────────────────────────┐       │
│     │  GitHub                              │       │
│     │  - Stores source code                │       │
│     └──────────────────────────────────────┘       │
│                                                     │
│  3. docker build -t user/app:latest .               │
│  4. docker push user/app:latest                     │
│                                                     │
│     ┌──────────────────────────────────────┐       │
│     │  Docker Hub                          │       │
│     │  - Stores pre-built images           │       │
│     │  - Version tagged (v1.0, v2.0, etc)  │       │
│     └──────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
                         ↓
                         ↓ docker pull
                         ↓
┌─────────────────────────────────────────────────────┐
│ Unraid Server                                       │
│                                                     │
│  1. docker-compose -f hub.yml pull                  │
│     └─→ Downloads pre-built image (30 sec)         │
│                                                     │
│  2. docker-compose -f hub.yml up -d                 │
│     └─→ Runs container immediately                 │
│                                                     │
│  Data: /mnt/user/appdata/budget-manager/           │
│  ├── docker-compose.hub.yml  ← Small config file   │
│  └── data/budget.db          ← Your database       │
│                                                     │
│  (No source code needed!)                           │
└─────────────────────────────────────────────────────┘

PROS: Fast deployment, no building on server
CONS: Requires Docker Hub account, extra step
```

---

## Side-by-Side Comparison

### Deployment Speed

**Local Build:**
```bash
Time to deploy: ~3 minutes
git clone        (30 seconds)
docker build     (2-3 minutes)  ← Slow!
docker run       (5 seconds)
```

**Docker Hub:**
```bash
Time to deploy: ~40 seconds
docker pull      (30 seconds)  ← Much faster!
docker run       (5 seconds)
```

---

### Update Speed

**Local Build:**
```bash
Time to update: ~3 minutes
git pull         (5 seconds)
docker build     (2-3 minutes)  ← Rebuild every time
docker restart   (5 seconds)
```

**Docker Hub:**
```bash
Time to update: ~40 seconds
docker pull      (30 seconds)   ← Just download new image
docker restart   (5 seconds)
```

---

### Disk Space

**Local Build:**
```
/mnt/user/appdata/budget-manager/
├── Source code      ~5 MB
├── node_modules/    ~50 MB
├── Docker image     ~150 MB
└── database         ~1 MB
Total: ~206 MB
```

**Docker Hub:**
```
/mnt/user/appdata/budget-manager/
├── Docker image     ~150 MB
└── database         ~1 MB
Total: ~151 MB (25% less!)
```

---

## Real-World Example

### Scenario: You fix a bug

**With Local Build:**
```bash
# On dev machine
nano server.js              # Fix bug
git add . && git commit -m "Fix" && git push
# 1 minute

# On Unraid
git pull                    # 5 seconds
docker-compose build        # 180 seconds (3 min)
docker-compose up -d        # 5 seconds
# Total: ~190 seconds (3+ minutes)
```

**With Docker Hub:**
```bash
# On dev machine
nano server.js              # Fix bug
git add . && git commit -m "Fix" && git push
docker build -t user/app:latest .  # 120 seconds (local)
docker push user/app:latest        # 30 seconds
# 3 minutes total (but you do this once)

# On Unraid (fast!)
docker-compose pull         # 30 seconds
docker-compose up -d        # 5 seconds
# Total: ~35 seconds

# If you have 5 servers:
# Local Build: 3 min × 5 = 15 minutes total
# Docker Hub:  35 sec × 5 = ~3 minutes total
```

---

## Which Should You Use?

### Single Server + Learning → Local Build

```
You ─→ GitHub ─→ Unraid (build + run)

Simple workflow
No extra accounts
Good for learning
```

### Multiple Servers + Production → Docker Hub

```
You ─→ GitHub ─→ Docker Hub
                    ↓
         Unraid 1 (pull + run)
         Unraid 2 (pull + run)
         Unraid 3 (pull + run)

Fast deployments
Professional workflow
Easy sharing
```

### Both (Recommended Eventually)

```
Dev:        Local build (fast iteration)
Production: Docker Hub (fast deployment)
```

---

## The Commands You'll Use

### Local Build (docker-compose.yml)
```bash
docker-compose up -d              # Build and start
docker-compose down               # Stop
docker-compose build --no-cache   # Rebuild
docker-compose logs -f            # Logs
```

### Docker Hub (docker-compose.hub.yml)
```bash
# Dev machine
docker build -t user/app:latest .
docker push user/app:latest

# Unraid
docker-compose -f docker-compose.hub.yml pull
docker-compose -f docker-compose.hub.yml up -d
docker-compose -f docker-compose.hub.yml logs -f
```

---

## How They Connect to GitHub

**Important:** Neither pulls code from GitHub directly!

### Local Build:
```
GitHub → (you manually git clone) → Unraid
         Source code on server
         Docker builds from source
```

### Docker Hub:
```
GitHub → (you manually build + push) → Docker Hub
         No source needed on server
         Docker pulls pre-built image
```

**Both require Git** for version control, but Docker itself doesn't use Git.

---

## Migration Path

**Start:** Local Build
```bash
docker-compose up -d
# Learn the system
# Make changes
# Test things
```

**Later:** Add Docker Hub
```bash
# Set up Docker Hub
docker login
docker build -t user/app:latest .
docker push user/app:latest

# Switch Unraid to pull from Hub
docker-compose -f docker-compose.hub.yml up -d

# Now updates are faster!
```

---

## File Reference

| File | Purpose | When to Use |
|------|---------|-------------|
| `docker-compose.yml` | Local build | Default, development |
| `docker-compose.local.yml` | Local build (explicit) | When you want to be clear |
| `docker-compose.hub.yml` | Docker Hub | Production, multiple servers |
| `DOCKER-HUB-GUIDE.md` | Full guide | When setting up Docker Hub |

---

## Summary

**Your Question:** How does docker-compose pull from Git?

**Answer:** It doesn't! Two separate systems:

1. **Git** (GitHub): Stores source code
   - `git clone` downloads code
   - `git pull` updates code

2. **Docker** (Local or Hub): Runs containers
   - **Local:** `build: .` builds from source
   - **Hub:** `image: user/app` pulls from registry

**Current setup:** Build locally from source
**Alternative:** Pull from Docker Hub (faster, cleaner)

Both are valid! See DOCKER-HUB-GUIDE.md for complete details. 🚀
