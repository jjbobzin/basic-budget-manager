# Quick Reference Card - Docker & GitHub

## 🚀 Three Ways to Deploy

### 1️⃣ Local Docker
```bash
docker-compose up -d
# Access: http://localhost:3000
```

### 2️⃣ Unraid
```bash
# Upload to: /mnt/user/appdata/budget-manager/
# Compose Manager → Point to docker-compose.yml → Compose Up
# Access: http://[unraid-ip]:3000
```

### 3️⃣ GitHub → Anywhere
```bash
git clone https://github.com/YOU/budget-manager.git
cd budget-manager && docker-compose up -d
```

---

## 🐳 Essential Docker Commands

| Command | Action |
|---------|--------|
| `docker-compose up -d` | Start containers |
| `docker-compose down` | Stop containers |
| `docker-compose logs -f` | View live logs |
| `docker-compose build` | Rebuild image |
| `docker-compose ps` | List containers |
| `docker-compose restart` | Restart containers |

---

## 📝 Essential Git Commands

| Command | Action |
|---------|--------|
| `git status` | Check changes |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Commit changes |
| `git push` | Push to GitHub |
| `git pull` | Pull from GitHub |
| `git clone [url]` | Clone repository |

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Container definition |
| `docker-compose.yml` | Multi-container config |
| `.dockerignore` | Exclude from image |
| `.gitignore` | Exclude from Git |
| `unraid-template.xml` | Unraid template |
| `data/budget.db` | Your database |

---

## 🔧 Common Tasks

### First-Time GitHub Setup
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOU/budget-manager.git
git push -u origin main
```

### Deploy to Unraid from GitHub
```bash
ssh root@unraid-ip
cd /mnt/user/appdata
git clone https://github.com/YOU/budget-manager.git
cd budget-manager
docker-compose up -d
```

### Update Unraid Deployment
```bash
cd /mnt/user/appdata/budget-manager
git pull
docker-compose up -d --build
```

### Change Port
Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Change 8080 to your port
```

### Backup Database
```bash
cp data/budget.db backups/budget-$(date +%Y%m%d).db
```

---

## 🌐 Access URLs

| Location | URL |
|----------|-----|
| Local | `http://localhost:3000` |
| Unraid (local) | `http://localhost:3000` |
| Unraid (network) | `http://[unraid-ip]:3000` |
| Reverse proxy | `http://budget.local` |

---

## 📍 Data Locations

| Environment | Database Path |
|-------------|---------------|
| Local Docker | `./data/budget.db` |
| Unraid | `/mnt/user/appdata/budget-manager/data/budget.db` |
| Container | `/app/data/budget.db` |

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | Change port in docker-compose.yml |
| Can't access | Check firewall, verify port mapping |
| Database missing | Check volume mount in docker-compose.yml |
| Git push fails | Use Personal Access Token, not password |
| Container crashes | Check logs: `docker-compose logs` |

---

## 📚 Full Documentation

- **[DEPLOYMENT-SUMMARY.md](DEPLOYMENT-SUMMARY.md)** - Complete overview
- **[DOCKER.md](DOCKER.md)** - Full Docker & Unraid guide
- **[GITHUB.md](GITHUB.md)** - Full GitHub guide
- **[QUICKSTART.md](QUICKSTART.md)** - Local setup
- **[README.md](README.md)** - Main documentation

---

## 🎯 Workflow Cheatsheet

### Daily Development
```bash
# Make changes → Save → Test
docker-compose restart  # If needed
git add . && git commit -m "Changes" && git push
```

### Deploy New Version
```bash
# On development machine
git push

# On Unraid
git pull
docker-compose up -d --build
```

### Reset Everything
```bash
docker-compose down -v  # Removes container AND data
rm -rf data/            # Delete database
docker-compose up -d    # Fresh start
```

---

## ✅ Pre-Deployment Checklist

- [ ] Test locally: `docker-compose up -d`
- [ ] Access works: `http://localhost:3000`
- [ ] Database persists: Add bill, restart, check it's there
- [ ] Push to GitHub: `git push`
- [ ] Clone elsewhere: `git clone` and test
- [ ] Deploy to Unraid: Follow DOCKER.md
- [ ] Network access: Test from phone
- [ ] Backup works: Export data or copy budget.db

---

## 🎉 You're Production-Ready!

Your app now has:
- ✅ Docker containerization
- ✅ Unraid compatibility  
- ✅ GitHub version control
- ✅ One-click deployment
- ✅ Data persistence
- ✅ Network access
- ✅ Complete documentation

**Go deploy!** 🚀
