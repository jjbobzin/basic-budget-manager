# PowerShell Commands for Windows

## ⚠️ PowerShell vs Bash

The documentation uses bash syntax (`&&`) which doesn't work in PowerShell.

**Use these commands instead:**

---

## Git Commands for PowerShell

### Initial Setup
```powershell
# Separate commands (always works)
git init
git add .
git commit -m "Complete budget manager"

# Or use semicolons
git init; git add .; git commit -m "Complete budget manager"
```

### Push to GitHub
```powershell
# If origin already exists (your case), remove it first
git remote remove origin
git remote add origin https://github.com/jjbobzin/budget-manager.git
git branch -M main
git push -u origin main
```

### Or if origin exists and is correct
```powershell
git push -u origin main
```

---

## Status Check

```powershell
# Check what's been committed
git status

# View commit history
git log --oneline

# Check remote
git remote -v
```

---

## Making Updates Later

```powershell
# Make changes, then:
git add .
git commit -m "Your message here"
git push
```

---

## Docker Commands (When on Unraid)

These are bash commands, run them in Unraid's terminal (SSH):

```bash
# SSH uses bash, so && works here
ssh root@YOUR_UNRAID_IP
cd /mnt/user/appdata/budget-manager
git pull && docker-compose down && docker-compose build && docker-compose up -d
```

---

## Your Current Status

Based on your output:

✅ **"Everything up-to-date"** - Your code IS on GitHub!
✅ **Repository connected** - origin is set correctly
✅ **Branch tracked** - main branch is tracking origin/main

**You're good to go!** The push worked.

---

## Verify on GitHub

1. Go to https://github.com/jjbobzin/budget-manager
2. You should see all your files
3. Including the new `index.html` with login/wizard

---

## If You Made Changes in VSCode

**Check what was committed:**
```powershell
git log --oneline -5
```

**See what files changed:**
```powershell
git diff HEAD~1
```

**If you're not sure what got pushed:**
```powershell
# Compare local to remote
git fetch origin
git diff origin/main
```

If it says nothing, you're in sync!

---

## Quick Reference

### PowerShell (Windows)
```powershell
# Use ; instead of &&
git add .; git commit -m "message"; git push

# Or separate lines
git add .
git commit -m "message"
git push
```

### Bash (Unraid/Linux/Mac)
```bash
# Can use &&
git add . && git commit -m "message" && git push
```

---

## Common PowerShell Git Commands

```powershell
# Status
git status

# Add all changes
git add .

# Commit
git commit -m "Your message"

# Push
git push

# Pull
git pull

# Check remotes
git remote -v

# View history
git log --oneline --graph --all

# Create branch
git checkout -b new-feature

# Switch branch
git checkout main

# Merge branch
git merge new-feature
```

---

## VSCode Git Integration

**If you used VSCode's Git panel:**

✅ It handles everything for you
✅ Staging, committing, pushing
✅ Should work fine

**To verify:**
1. Open Source Control panel (Ctrl+Shift+G)
2. Check if there are any uncommitted changes
3. Check the sync status

---

## Next Step: Deploy to Unraid

Since your code is on GitHub, deploy to Unraid:

```bash
# SSH to Unraid (this uses bash)
ssh root@YOUR_UNRAID_IP

# Clone and deploy
cd /mnt/user/appdata
git clone https://github.com/jjbobzin/budget-manager.git
cd budget-manager
docker-compose up -d
```

---

## Summary

**Your PowerShell Error:** Normal! PowerShell doesn't use `&&`
**Your Push Status:** Success! "Everything up-to-date" means it worked
**VSCode Changes:** Likely fine, verify with `git log`

**You're ready to deploy to Unraid!** 🚀
