# Development & Update Workflow

## Complete Guide: Extract → Deploy → Use → Update

This guide walks through the entire lifecycle of working with your Budget Manager app.

---

## 📦 Phase 1: Initial Setup (First Time Only)

### Step 1: Extract the Archive

```bash
# Extract the downloaded file
tar -xzf budget-app-server.tar.gz

# Navigate into the directory
cd budget-app-server

# See what's inside
ls -la
```

**You should see:**
- `server.js`, `database.js`, `package.json`
- `Dockerfile`, `docker-compose.yml`
- `public/` folder with `index.html`
- Documentation files (README.md, DOCKER.md, etc.)
- `.git` folder is NOT here yet (we'll create it)

### Step 2: Test Locally (Optional but Recommended)

```bash
# Install Node dependencies
npm install

# Run locally (non-Docker test)
npm start

# Open browser: http://localhost:54321
# Test the app, make sure it works
# Press Ctrl+C to stop
```

**Or test with Docker:**

```bash
# Build and run with Docker
docker-compose up -d

# Check it's running
docker-compose ps

# Open browser: http://localhost:54321
# Test the app

# View logs if needed
docker-compose logs -f

# Stop when done testing
docker-compose down
```

### Step 3: Initialize Git

```bash
# Initialize Git repository (creates .git folder)
git init

# Check status (should show all files as "untracked")
git status

# Add all files to Git
git add .

# Check status again (now shows files "staged")
git status

# Create first commit
git commit -m "Initial commit: Budget Manager v2.0 with Docker support"

# Verify commit was created
git log
```

**At this point:**
- ✅ Files are on your computer in a Git repository
- ❌ NOT yet on GitHub
- ❌ NOT yet running on Unraid

### Step 4: Push to GitHub

```bash
# First, create a repo on GitHub:
# 1. Go to github.com
# 2. Click "+" icon → "New repository"
# 3. Name it: budget-manager
# 4. Don't initialize with README (we have files already)
# 5. Click "Create repository"

# GitHub will show you commands, but here's what to do:
git remote add origin https://github.com/YOUR_USERNAME/budget-manager.git

# Verify remote was added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main

# Enter your GitHub username and Personal Access Token when prompted
```

**If you need a Personal Access Token:**
1. GitHub → Settings (your account) → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Give it a name: "Budget Manager"
5. Check scope: `repo` (full control)
6. Generate token
7. **COPY IT** (you won't see it again!)
8. Use this as your password when pushing

**Now:**
- ✅ Code is on GitHub at `https://github.com/YOUR_USERNAME/budget-manager`
- ✅ Anyone can clone it
- ✅ Version controlled

---

## 🚀 Phase 2: Deploy to Unraid

### Method A: Clone from GitHub (Recommended)

```bash
# SSH into Unraid
ssh root@your-unraid-ip

# Navigate to appdata
cd /mnt/user/appdata

# Clone your repo
git clone https://github.com/YOUR_USERNAME/budget-manager.git

# Navigate into it
cd budget-manager

# Start with Docker Compose
docker-compose up -d

# Check it's running
docker-compose ps

# View logs
docker-compose logs -f
```

**Access at:** `http://your-unraid-ip:54321`

### Method B: Upload Files Directly

1. Use Unraid's file browser or WinSCP
2. Upload entire `budget-app-server` folder to `/mnt/user/appdata/budget-manager/`
3. SSH in and run:
   ```bash
   cd /mnt/user/appdata/budget-manager
   docker-compose up -d
   ```

**Now:**
- ✅ Running 24/7 on your Unraid server
- ✅ Accessible from any device on your network
- ✅ Database persists in `/mnt/user/appdata/budget-manager/data/`

---

## 🎯 Phase 3: Daily Usage

### Using the App

1. **Open in browser:** `http://your-unraid-ip:54321`
2. **Budget Allocation tab:**
   - Enter your income
   - Add your bills
   - Set deposit amounts
   - See if your deposits cover bills
3. **Running Balance tab:**
   - View 12-month forecast
   - Click bills to override amounts
   - Mark transactions as cleared
4. **Settings (⚙️ button):**
   - Customize account names
5. **Export Data:**
   - Click "Export Data" for backups

### Finding Issues or Needed Features

As you use it, you'll notice:
- "This calculation seems off"
- "I wish it had feature X"
- "This button should do Y instead"
- "Can we add Z?"

**Write these down!** You'll address them in the next phase.

---

## 🔧 Phase 4: Making Changes

### Where to Make Changes

**On your development machine** (where you extracted the original files):

```bash
# Navigate to your local copy
cd /path/to/budget-app-server

# Make sure you're up to date
git pull

# Now edit files as needed
```

### Example Change #1: Fix a Bug

```bash
# Edit the file
nano server.js  # or use any editor

# Make your changes, save file

# Test locally
npm start
# Or with Docker:
docker-compose up -d

# Verify the fix works
# Open http://localhost:54321

# If it works, commit it
git add server.js
git commit -m "Fix: Corrected running balance calculation for leap years"
git push
```

### Example Change #2: Add a Feature

```bash
# Edit multiple files
nano public/index.html
nano server.js

# Test locally
docker-compose build --no-cache
docker-compose up -d

# Verify feature works
# Open http://localhost:54321

# Commit all changes
git add .
git commit -m "Feature: Added monthly budget comparison chart"
git push
```

### Example Change #3: Update Documentation

```bash
# Edit README
nano README.md

# Commit
git add README.md
git commit -m "Docs: Added troubleshooting section for port conflicts"
git push
```

**After pushing to GitHub:**
- ✅ Changes are version controlled
- ✅ Visible on GitHub
- ❌ NOT yet running on Unraid (need to update)

---

## 🔄 Phase 5: Updating Your Production Instance

### Update Unraid from GitHub

```bash
# SSH into Unraid
ssh root@your-unraid-ip

# Navigate to your app
cd /mnt/user/appdata/budget-manager

# Stop the running container
docker-compose down

# Pull latest changes from GitHub
git pull

# Rebuild the Docker image
docker-compose build --no-cache

# Start with new code
docker-compose up -d

# Verify it's running
docker-compose ps
docker-compose logs -f
```

**Your data is safe!**
- Database is in `/mnt/user/appdata/budget-manager/data/budget.db`
- This is a Docker volume that persists through updates
- Your bills, settings, and cleared transactions remain intact

### Quick Update (if you know there are changes)

```bash
cd /mnt/user/appdata/budget-manager
git pull && docker-compose down && docker-compose build --no-cache && docker-compose up -d
```

### Check What Changed

```bash
# Before pulling, see what's new
git fetch
git log HEAD..origin/main --oneline

# This shows commits you're about to pull
```

---

## 🔁 The Complete Cycle

Here's how it all flows together:

```
1. Development Machine
   │
   ├─ Make changes to code
   ├─ Test locally
   ├─ git add .
   ├─ git commit -m "message"
   ├─ git push
   │
   ↓
2. GitHub
   │
   ├─ Code is stored
   ├─ Version history maintained
   ├─ Accessible from anywhere
   │
   ↓
3. Unraid Server
   │
   ├─ git pull (download changes)
   ├─ docker-compose build (rebuild container)
   ├─ docker-compose up (run new version)
   │
   ↓
4. Production Use
   │
   ├─ Access from any device
   ├─ Data persists
   ├─ Notice new features/fixes
   │
   └─ Find more improvements needed → Back to step 1
```

---

## 💡 Common Scenarios

### Scenario: "I want to change the default account names"

```bash
# On development machine
cd budget-app-server
nano database.js  # Edit the default account names in generateRandomData()

# Test
npm start

# Commit
git add database.js
git commit -m "Changed default account names"
git push

# Update Unraid
ssh root@unraid-ip
cd /mnt/user/appdata/budget-manager
git pull
docker-compose up -d --build
```

### Scenario: "I found a calculation bug"

```bash
# Fix it locally
nano public/index.html  # Fix the JavaScript calculation

# Test thoroughly
docker-compose build
docker-compose up -d
# Test, test, test!

# Commit
git add public/index.html
git commit -m "Fix: Apple Savings now calculates correctly"
git push

# Update Unraid
ssh root@unraid-ip
cd /mnt/user/appdata/budget-manager
git pull && docker-compose build && docker-compose up -d
```

### Scenario: "I want to add a new bill frequency option"

```bash
# Edit multiple files
nano public/index.html    # Add "bi-weekly" option to dropdown
nano database.js          # Handle "bi-weekly" in getFrequencyMonths()

# Test
docker-compose build
docker-compose up -d

# Commit
git add .
git commit -m "Feature: Added bi-weekly bill frequency option"
git push

# Update Unraid
ssh root@unraid-ip
cd /mnt/user/appdata/budget-manager
git pull && docker-compose build --no-cache && docker-compose up -d
```

### Scenario: "Someone else wants to contribute"

```bash
# They fork your repo on GitHub
# They make changes in their fork
# They submit a Pull Request
# You review it on GitHub
# You merge if it looks good
# Then update Unraid:

ssh root@unraid-ip
cd /mnt/user/appdata/budget-manager
git pull && docker-compose build && docker-compose up -d
```

---

## 🎨 Advanced: Multiple Environments

### Setup Development + Production

**Development (your computer):**
```bash
cd budget-app-server
docker-compose up -d  # Runs on port 54321
# Access: http://localhost:54321
# Make changes, test, break things safely
```

**Production (Unraid):**
```bash
cd /mnt/user/appdata/budget-manager
docker-compose up -d  # Also runs on port 54321
# Access: http://unraid-ip:54321
# Stable version for daily use
```

**Only push to GitHub when development version is working!**

---

## 🐛 Testing Your Changes

### Before Pushing to GitHub

**Always test:**

1. **Locally without Docker:**
   ```bash
   npm start
   # Open http://localhost:54321
   # Test your changes
   ```

2. **Locally with Docker:**
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   # Test again to make sure Docker build works
   ```

3. **Check for errors:**
   ```bash
   docker-compose logs
   # Look for any error messages
   ```

4. **Test all features:**
   - Add a bill
   - Override an amount
   - Clear a transaction
   - Export data
   - Restart container and verify data persists

5. **Only then push:**
   ```bash
   git push
   ```

---

## 📊 Keeping Track of Changes

### Use Meaningful Commit Messages

**Good:**
```bash
git commit -m "Fix: Running balance now handles last day of month correctly"
git commit -m "Feature: Added dark mode toggle"
git commit -m "Docs: Updated README with new port information"
```

**Bad:**
```bash
git commit -m "fixed stuff"
git commit -m "update"
git commit -m "changes"
```

### Create Releases

When you have a stable version:

```bash
# Tag the version
git tag v2.1.0
git push --tags

# On GitHub, create a release from this tag
# Write release notes explaining what changed
```

---

## 🆘 When Things Go Wrong

### "My changes broke the app!"

```bash
# Revert to previous commit
git log  # Find the last good commit hash
git revert <commit-hash>
git push

# Or reset completely (DANGER - loses commits)
git reset --hard <last-good-commit>
git push --force
```

### "Unraid version is broken!"

```bash
# SSH into Unraid
cd /mnt/user/appdata/budget-manager

# Go back to previous version
git log  # Find last good commit
git reset --hard <commit-hash>
docker-compose build
docker-compose up -d
```

### "I lost my database!"

**That's why you backup!**

```bash
# If you exported data:
# 1. Open app
# 2. Import the JSON file

# If you have database backup:
cp backup/budget.db data/budget.db
docker-compose restart
```

---

## ✅ Best Practices

1. **Test before pushing**
   - Always test changes locally first
   - Don't push broken code

2. **Commit often**
   - Small commits are better than huge ones
   - Easier to revert if needed

3. **Write good commit messages**
   - Future you will thank you

4. **Backup before major changes**
   - Export data from app
   - Or copy `data/budget.db`

5. **Update Unraid during low-usage times**
   - Early morning or late night
   - Minimal disruption

6. **Keep development and production separate**
   - Test on dev machine
   - Deploy to Unraid when stable

7. **Document your changes**
   - Update README when adding features
   - Add comments in code

---

## 🎯 Summary: Your Workflow

**Regular workflow:**
```bash
# 1. Make changes on dev machine
cd budget-app-server
# Edit files

# 2. Test locally
docker-compose build && docker-compose up -d

# 3. Commit and push
git add .
git commit -m "Description"
git push

# 4. Update Unraid
ssh root@unraid-ip
cd /mnt/user/appdata/budget-manager
git pull && docker-compose build && docker-compose up -d

# 5. Verify it works
# Open browser to http://unraid-ip:54321

# Done!
```

**That's it!** This is the cycle you'll repeat as you improve the app over time.

---

## 📞 Getting Help

**If stuck:**
1. Check `docker-compose logs` for errors
2. Test locally first to isolate the issue
3. Check GitHub for similar issues
4. Review this guide again
5. Ask for help with specific error messages

**Include when asking for help:**
- What you're trying to do
- What you expected to happen
- What actually happened
- Error messages (full text)
- Steps you've already tried

---

## 🎉 You're Ready!

You now understand:
- ✅ How to extract and initialize Git
- ✅ How to push to GitHub
- ✅ How to deploy to Unraid
- ✅ How to make changes locally
- ✅ How to test your changes
- ✅ How to push updates
- ✅ How to update production
- ✅ The complete development cycle

**Go build amazing features!** 🚀
