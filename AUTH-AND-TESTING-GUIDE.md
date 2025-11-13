# Authentication & Setup Wizard Guide

## 🆕 What's New - v2.1

### ✅ Login Authentication
- Username/password protection
- Secure password hashing with bcrypt
- Session-based authentication
- 24-hour session duration
- Password change functionality

### ✅ Setup Wizard
- First-time setup walkthrough
- Creates initial user account
- Configures income and account deposits
- Add initial bills during setup
- One-time wizard (only shows when no users exist)

### ✅ All Data Persists on Unraid
- Database stored in Docker volume
- Survives container restarts
- Survives code updates
- Safe to use for testing and production
- Easy backups

---

## 🔐 How Authentication Works

### Initial Setup Flow

**First Visit (No Users Exist):**
1. App checks `/api/setup/status`
2. Sees `needsSetup: true`
3. Shows Setup Wizard
4. User enters:
   - Username and password
   - Income per paycheck
   - Payroll days
   - Account names and deposits
   - Starting balance
   - Optional: Initial bills
5. Wizard creates user and settings
6. User is automatically logged in

**Subsequent Visits:**
1. App checks `/api/auth/status`
2. If not authenticated → Show login screen
3. User enters credentials
4. On success → Access full app

### Session Management

**Sessions last 24 hours:**
- Stored in memory (restarts = logout)
- HttpOnly cookies (more secure)
- Can be extended if needed

**Session Storage:**
- Default: In-memory (fine for single user)
- Production: Can use session store (Redis, etc.)

---

## 📊 Data Persistence on Unraid

### Where Your Data Lives

**On Unraid Server:**
```
/mnt/user/appdata/budget-manager/
├── docker-compose.yml          # Config
├── data/                       # Your persistent data
│   └── budget.db              # SQLite database
│       ├── users table        # Login credentials
│       ├── settings table     # Income, accounts
│       ├── bills table        # All your bills
│       ├── overrides table    # Amount overrides
│       └── cleared_transactions # Cleared items
└── (source code if using local build)
```

**Inside Container:**
```
/app/
├── server.js                   # App code
├── database.js                 # Database code
└── data/                       # Mounted volume
    └── budget.db              # Same as host!
```

**The Magic:**
```yaml
# In docker-compose.yml
volumes:
  - ./data:/app/data    # Host:Container
```

This means:
- ✅ Data written in container → Saved on host
- ✅ Container restarts → Data still there
- ✅ Code updates → Data unchanged
- ✅ Container deleted → Data safe!

---

## 🧪 Testing on Unraid - Complete Guide

### Yes, You Can Fully Test on Unraid!

**Everything persists through:**
- Container restarts
- Code updates
- Docker rebuilds
- Server reboots (Unraid itself)

**What's Safe:**
- Adding real bills
- Testing calculations
- Clearing transactions
- Changing settings
- Using real data

**What Resets:**
- Sessions (after restart, need to login again)
- In-memory cache (if any)

---

## 🚀 Testing Workflow

### Initial Deployment

```bash
# SSH to Unraid
ssh root@YOUR_UNRAID_IP

# Clone your repo
cd /mnt/user/appdata
git clone https://github.com/jjbobzin/budget-manager.git
cd budget-manager

# Start the app
docker-compose up -d

# Check it's running
docker-compose ps
docker-compose logs -f
```

**Access:** http://YOUR_UNRAID_IP:54321

### First Use - Setup Wizard

1. **Open app in browser**
   - You'll see the Setup Wizard

2. **Create Your Account**
   - Username: `admin` (or whatever you want)
   - Password: `your-secure-password`
   - Remember these!

3. **Configure Income**
   - Income per paycheck: `5000`
   - Payroll day 1: `15`
   - Payroll day 2: `31` (last day)

4. **Name Your Accounts**
   - Bills account: `Bills Checking`
   - Bills deposit: `2500`
   - Personal account: `Personal Spending`
   - Personal deposit: `1500`
   - Savings 1: `Emergency Fund`
   - Savings 1 deposit: `500`
   - Savings 2: `Vacation Fund`
   - Starting balance: `1000`

5. **Add Initial Bills (Optional)**
   - Name: `Mortgage`
   - Amount: `1800`
   - Due day: `1`
   - Frequency: `monthly`
   - (Add more bills as needed)

6. **Complete Setup**
   - Click "Complete Setup"
   - You're automatically logged in!

---

## 🧪 Testing Scenarios

### Test 1: Data Persists Through Restart

```bash
# 1. Add a bill through the UI
# 2. Restart container
docker-compose restart

# 3. Refresh browser
# 4. Login again
# 5. Bill is still there! ✅
```

### Test 2: Data Persists Through Code Update

```bash
# 1. Have bills and settings configured
# 2. Update code on GitHub
# 3. Pull and rebuild on Unraid
cd /mnt/user/appdata/budget-manager
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 4. Login
# 5. All your data is still there! ✅
```

### Test 3: Add Real Data

```bash
# It's safe to add your real bills!
# Everything persists, so feel free to:
- Add all your bills
- Set actual amounts
- Configure real accounts
- Test the forecasting
- Clear transactions
```

### Test 4: Backup Your Data

```bash
# SSH to Unraid
cd /mnt/user/appdata/budget-manager/data

# Copy database
cp budget.db budget-backup-$(date +%Y%m%d).db

# Or download via WinSCP
# Location: /mnt/user/appdata/budget-manager/data/budget.db
```

---

## 🔄 Update Workflow (With Data Safe)

### Making Code Changes

**On Dev Machine:**
```bash
# 1. Make changes
nano server.js

# 2. Test locally
npm install  # If you added dependencies
npm start

# 3. Commit and push
git add .
git commit -m "Added new feature"
git push
```

**On Unraid:**
```bash
# 1. Pull changes
cd /mnt/user/appdata/budget-manager
git pull

# 2. Rebuild (installs new dependencies)
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 3. Login and test
# Your data is still there!
```

**What Happens:**
- ✅ New code deployed
- ✅ Dependencies installed
- ✅ Database unchanged
- ✅ Users unchanged
- ✅ Bills unchanged
- ✅ Settings unchanged
- ⚠️ Session reset (need to login again)

---

## 🔐 Security Considerations

### Current Setup (Local Network)

**Secure enough for:**
- ✅ Home network use
- ✅ Local Unraid access
- ✅ VPN access to Unraid

**Security features:**
- ✅ Password hashing (bcrypt)
- ✅ HttpOnly cookies
- ✅ Session-based auth
- ✅ Protected API endpoints

**Not secure enough for:**
- ❌ Direct internet exposure
- ❌ Public access
- ❌ Shared hosting

### For Internet Access (Advanced)

**Would need:**
1. HTTPS (reverse proxy with SSL)
2. Rate limiting
3. CSRF protection
4. Session store (Redis)
5. Stronger session secrets

**Recommendation:** Keep it local or use VPN

---

## 💾 Backup Strategies

### Option 1: Manual Backup

```bash
# SSH to Unraid
cd /mnt/user/appdata/budget-manager/data
cp budget.db ~/backups/budget-$(date +%Y%m%d).db
```

### Option 2: Export Feature

1. Open app
2. Click "Export Data"
3. Saves JSON file with all data
4. Store in Dropbox/Drive/etc

### Option 3: Unraid Appdata Backup

1. Install "Appdata Backup" plugin
2. Configure to include `/mnt/user/appdata/budget-manager/`
3. Schedule automatic backups

### Option 4: Scheduled Script

```bash
#!/bin/bash
# Add to User Scripts plugin

SOURCE="/mnt/user/appdata/budget-manager/data/budget.db"
DEST="/mnt/user/backups/budget-manager"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p $DEST
cp $SOURCE $DEST/budget-$DATE.db

# Keep only last 30 days
find $DEST -name "budget-*.db" -mtime +30 -delete
```

---

## 🎯 Common Testing Tasks

### Check Database Directly

```bash
# SSH to Unraid
cd /mnt/user/appdata/budget-manager

# Install sqlite3 (if not installed)
apt-get update && apt-get install -y sqlite3

# Open database
sqlite3 data/budget.db

# Check users
SELECT * FROM users;

# Check settings
SELECT * FROM settings;

# Check bills
SELECT * FROM bills;

# Exit
.exit
```

### View Logs

```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific container
docker logs budget-manager -f
```

### Check Container Status

```bash
# List containers
docker-compose ps

# Container details
docker inspect budget-manager

# Resource usage
docker stats budget-manager
```

### Reset Everything (Testing)

```bash
# DANGER: This deletes ALL data!
cd /mnt/user/appdata/budget-manager
docker-compose down
rm -rf data/
mkdir data
docker-compose up -d

# Fresh start - setup wizard will appear again
```

---

## 🐛 Troubleshooting

### "Can't login after restart"

**Cause:** Sessions are in-memory (not persisted)
**Solution:** Normal behavior - just login again
**Optional:** Implement session store for persistence

### "Database is locked"

**Cause:** Multiple processes accessing database
**Solution:**
```bash
docker-compose restart
# SQLite should handle this, but restart fixes it
```

### "Changes not saving"

**Check volume mount:**
```bash
docker inspect budget-manager | grep -A 10 Mounts
```

Should show:
```
"Source": "/mnt/user/appdata/budget-manager/data",
"Destination": "/app/data",
```

### "Can't access from other devices"

**Check:**
1. Container is running: `docker-compose ps`
2. Port is correct: 54321
3. Firewall allows local network
4. Using Unraid IP, not localhost

---

## ✅ Testing Checklist

**Initial Setup:**
- [ ] Deploy to Unraid
- [ ] Access via browser
- [ ] Complete setup wizard
- [ ] Create user account
- [ ] Configure income/accounts

**Basic Testing:**
- [ ] Add a bill
- [ ] Restart container → Bill still there
- [ ] Change a setting
- [ ] Restart → Setting persists
- [ ] Override an amount
- [ ] Clear a transaction

**Code Update Testing:**
- [ ] Make a code change
- [ ] Push to GitHub
- [ ] Pull on Unraid
- [ ] Rebuild container
- [ ] Login → Data still there

**Backup Testing:**
- [ ] Export data via UI
- [ ] Copy budget.db file
- [ ] Verify backup works

**Access Testing:**
- [ ] Access from Unraid itself
- [ ] Access from computer
- [ ] Access from phone/tablet
- [ ] All on local network

---

## 🎉 Summary

**You can absolutely test on Unraid!**

✅ **All data persists** in the Docker volume
✅ **Safe for real data** - won't lose anything
✅ **Survives updates** - code changes, data stays
✅ **Survives restarts** - container, server, whatever
✅ **Easy backups** - just copy the .db file
✅ **Professional auth** - username/password protection
✅ **Setup wizard** - easy first-time configuration

**Test away!** Your data is safe. 🚀

**Next Steps:**
1. Deploy to Unraid
2. Complete setup wizard
3. Add your real bills
4. Test the forecasting
5. Make improvements as needed
