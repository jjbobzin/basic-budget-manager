# GitHub Setup Guide

## Complete Guide to Putting Your Budget Manager on GitHub

---

## Why GitHub?

✅ **Version control** - Track all changes
✅ **Backup** - Code stored in the cloud
✅ **Sharing** - Easy to share with others
✅ **Collaboration** - Others can contribute
✅ **Docker Hub integration** - Auto-build images
✅ **Free** - Public repos are free

---

## Prerequisites

1. **GitHub Account** - [Sign up free](https://github.com/signup)
2. **Git installed** - [Download here](https://git-scm.com/downloads)

**Verify Git is installed**:
```bash
git --version
```

---

## Step-by-Step: First Time Setup

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **+** icon (top right) → **New repository**
3. Fill in details:
   - **Repository name**: `budget-manager`
   - **Description**: "Personal budget management app with SQLite database"
   - **Visibility**: Public (or Private if you prefer)
   - **Initialize**: ❌ Don't check any boxes (we have files already)
4. Click **Create repository**

### Step 2: Prepare Your Local Files

```bash
# Navigate to your app directory
cd /path/to/budget-app-server

# Initialize git (if not already)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Budget Manager v2.0"
```

### Step 3: Connect to GitHub

```bash
# Add GitHub as remote (replace with your username)
git remote add origin https://github.com/YOUR_USERNAME/budget-manager.git

# Verify remote was added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

**Enter credentials when prompted**:
- Username: Your GitHub username
- Password: Use a Personal Access Token (not your password)

### Step 4: Create Personal Access Token (if needed)

If GitHub asks for a password and rejects it:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Give it a name: "Budget Manager"
4. Select scopes: Check **repo** (full control of private repos)
5. Click **Generate token**
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

---

## Your Repository Structure

After pushing, GitHub will show:

```
budget-manager/
├── .dockerignore
├── .gitignore
├── CHANGES.md
├── DOCKER.md
├── Dockerfile
├── GITHUB.md           (this file)
├── QUICKSTART.md
├── README.md
├── database.js
├── docker-compose.yml
├── package.json
├── server.js
└── public/
    └── index.html
```

**Note**: `node_modules/`, `budget.db`, and `data/` are excluded by `.gitignore`

---

## Making Updates

### Typical Workflow

```bash
# 1. Make changes to your code
# Edit files...

# 2. See what changed
git status

# 3. Stage changes
git add .

# 4. Commit changes
git commit -m "Description of what you changed"

# 5. Push to GitHub
git push
```

### Example Update

```bash
# You fixed a bug
git add server.js
git commit -m "Fix: Corrected date calculation in running balance"
git push

# You added a feature
git add .
git commit -m "Feature: Added monthly budget comparison chart"
git push
```

---

## Cloning to Another Machine

On a new computer or your Unraid server:

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/budget-manager.git

# Navigate into it
cd budget-manager

# Install dependencies
npm install

# Run it
npm start
```

Or with Docker:

```bash
git clone https://github.com/YOUR_USERNAME/budget-manager.git
cd budget-manager
docker-compose up -d
```

---

## Branch Strategy

### Simple Strategy (Solo Developer)

**Just use `main` branch** - Perfect for personal projects

```bash
# All work on main
git add .
git commit -m "Update description"
git push
```

### Advanced Strategy (Team or Experimental Features)

**Use feature branches**:

```bash
# Create feature branch
git checkout -b feature/dark-mode

# Make changes
# Edit files...

# Commit to feature branch
git add .
git commit -m "Add dark mode toggle"
git push -u origin feature/dark-mode

# Merge back to main when ready
git checkout main
git merge feature/dark-mode
git push
```

---

## README.md Best Practices

Your README.md should be the main documentation. Here's a good structure:

```markdown
# Budget Manager

Personal budget management application with SQLite database.

## Features
- Budget allocation calculator
- 12-month cash flow forecast
- Bill management with frequencies
- Docker support

## Quick Start

### Local Development
```bash
npm install
npm start
```

### Docker
```bash
docker-compose up -d
```

### Unraid
See [DOCKER.md](DOCKER.md) for detailed Unraid instructions.

## Documentation
- [Quick Start Guide](QUICKSTART.md)
- [Docker Deployment](DOCKER.md)
- [Change Log](CHANGES.md)

## License
MIT
```

---

## Adding a License

1. Go to your GitHub repo page
2. Click **Add file** → **Create new file**
3. Name it: `LICENSE`
4. Click **Choose a license template**
5. Select: **MIT License** (most common for open source)
6. Fill in your name
7. Click **Review and submit**
8. Commit the file

---

## Creating Releases

When you want to mark specific versions:

1. Go to your repo → **Releases** → **Create a new release**
2. Click **Choose a tag** → Type: `v2.0.0` → **Create new tag**
3. Release title: `Budget Manager v2.0`
4. Description: List features/changes
5. Attach files: Optional (e.g., pre-built binary)
6. Click **Publish release**

Users can now download specific versions:
```bash
git clone --branch v2.0.0 https://github.com/YOUR_USERNAME/budget-manager.git
```

---

## Docker Hub Integration (Optional)

To auto-build Docker images from GitHub:

### Step 1: Create Docker Hub Account

1. Go to [hub.docker.com](https://hub.docker.com)
2. Sign up (free)

### Step 2: Create Repository

1. Click **Create Repository**
2. Name: `budget-manager`
3. Visibility: Public or Private
4. Click **Create**

### Step 3: Link GitHub

1. Go to your Docker Hub repo
2. Click **Builds** tab
3. Click **Link to GitHub**
4. Authorize Docker Hub to access GitHub
5. Select your `budget-manager` repo
6. Configure build rules:
   - Source: `main` branch
   - Docker tag: `latest`
7. Click **Save and Build**

### Step 4: Use Your Image

After the build completes:

```bash
docker pull YOUR_DOCKERHUB_USERNAME/budget-manager:latest
docker run -d -p 3000:3000 YOUR_DOCKERHUB_USERNAME/budget-manager
```

Or update your `docker-compose.yml`:

```yaml
services:
  budget-manager:
    image: YOUR_DOCKERHUB_USERNAME/budget-manager:latest
    # ... rest of config
```

---

## GitHub Actions (Automated Testing)

Create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test  # Add tests first!
      
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t budget-manager .
```

This automatically tests your code on every push!

---

## Collaborating with Others

### Give Someone Access

1. Go to repo → **Settings** → **Collaborators**
2. Click **Add people**
3. Enter their GitHub username
4. Select permission level (Write recommended)
5. They'll receive an invite

### Accepting Contributions

When someone suggests changes:

1. They fork your repo
2. Make changes in their fork
3. Submit a Pull Request (PR)
4. You review the PR
5. Merge if it looks good

---

## Common Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo changes to a file
git checkout -- filename.js

# Pull latest from GitHub
git pull

# Create new branch
git checkout -b new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature-branch

# Delete local branch
git branch -d feature-branch

# Delete remote branch
git push origin --delete feature-branch

# See all branches
git branch -a

# Stash uncommitted changes
git stash
git stash pop

# Tag a commit
git tag v2.0.1
git push --tags
```

---

## Protecting Your Main Branch

Prevent accidental direct pushes to main:

1. Go to repo → **Settings** → **Branches**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Check:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
5. Click **Create**

Now all changes must go through pull requests.

---

## Secrets and Sensitive Data

**NEVER commit**:
- Passwords
- API keys
- Private data
- Account numbers

If you accidentally commit secrets:

1. **Remove from history**:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/secret.txt" \
     --prune-empty --tag-name-filter cat -- --all
   ```

2. **Force push**:
   ```bash
   git push origin --force --all
   ```

3. **Rotate the secret** (change password/key)

**Better**: Use `.gitignore` to prevent this:

```
# .gitignore
.env
secrets.json
*.key
```

---

## Unraid-Specific GitHub Workflow

### Deploy from GitHub to Unraid

```bash
# SSH into Unraid
ssh root@unraid-ip

# Navigate to appdata
cd /mnt/user/appdata

# Clone your repo
git clone https://github.com/YOUR_USERNAME/budget-manager.git

# Build and run
cd budget-manager
docker-compose up -d
```

### Update from GitHub

```bash
# SSH into Unraid
ssh root@unraid-ip
cd /mnt/user/appdata/budget-manager

# Pull latest changes
git pull

# Rebuild container
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Making Your Repo Popular

### Add Badges

In your README.md:

```markdown
![Docker](https://img.shields.io/badge/docker-compatible-blue)
![Node](https://img.shields.io/badge/node-18+-green)
![License](https://img.shields.io/badge/license-MIT-blue)
```

### Add Topics

1. Go to repo
2. Click ⚙️ next to "About"
3. Add topics: `budget`, `finance`, `docker`, `unraid`, `nodejs`, `sqlite`

### Write Good Documentation

- Clear README
- Screenshots
- Usage examples
- Troubleshooting section

---

## Backup Strategy

Your code is on GitHub, but what about your data?

**Option 1**: Separate data repo (private)
```bash
cd data/
git init
git add budget.db
git commit -m "Backup"
git push to-private-repo
```

**Option 2**: Export feature in app
- Use the Export button to save JSON backups
- Store these elsewhere (Dropbox, etc.)

**Option 3**: Unraid CA Backup
- Include `/mnt/user/appdata/budget-manager/data` in backups

---

## Complete First-Time Example

```bash
# 1. Navigate to your app
cd /path/to/budget-app-server

# 2. Initialize Git
git init

# 3. Add files
git add .

# 4. First commit
git commit -m "Initial commit: Budget Manager v2.0 with Docker support"

# 5. Create repo on GitHub (do this in browser first)
# https://github.com/new

# 6. Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/budget-manager.git

# 7. Push
git branch -M main
git push -u origin main

# Done! Your code is on GitHub
```

---

## Troubleshooting

### "Authentication failed"
**Solution**: Use a Personal Access Token instead of password

### "Repository not found"
**Solution**: Check the URL is correct: `git remote -v`

### "Permission denied"
**Solution**: 
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/budget-manager.git
```

### "Merge conflicts"
**Solution**:
```bash
# Pull latest first
git pull
# Manually resolve conflicts in files
# Then commit
git add .
git commit -m "Resolved merge conflicts"
git push
```

---

## Resources

- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Markdown Guide](https://www.markdownguide.org/)
- [Choose a License](https://choosealicense.com/)

---

## Summary: Your GitHub Workflow

**Setup** (once):
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOU/budget-manager.git
git push -u origin main
```

**Daily workflow**:
```bash
# Make changes
git add .
git commit -m "What you changed"
git push
```

**Deploy to Unraid**:
```bash
ssh root@unraid
cd /mnt/user/appdata
git clone https://github.com/YOU/budget-manager.git
cd budget-manager
docker-compose up -d
```

**Update on Unraid**:
```bash
cd /mnt/user/appdata/budget-manager
git pull
docker-compose up -d --build
```

**That's it!** You're now using professional version control and deployment workflows. 🚀
