# 🎉 Multi-User Update - Complete Guide

## 🆕 What's Being Added

### Complete Multi-User Support
- ✅ Each user has their own separate budget
- ✅ Own bills, settings, forecasts, cleared transactions
- ✅ Complete data isolation
- ✅ First user automatically becomes admin

### Admin Controls
- ✅ Toggle registration on/off
- ✅ View all users
- ✅ Delete users (and all their data)
- ✅ Promote users to admin
- ✅ View system statistics

### Registration System
- ✅ Self-registration page (when enabled)
- ✅ Admin can disable registrations
- ✅ Existing users always work

---

## 🔄 Database Changes

### New Structure:

**Users Table:**
- Added `is_admin` field (0 or 1)
- First user = admin automatically

**System Settings Table (NEW):**
- `allow_registration` - Admin can toggle

**Settings Table:**
- Now has `user_id` (one settings per user)
- Removed CHECK (id = 1) constraint

**Bills Table:**
- Now has `user_id` - each user's bills isolated

**Overrides Table:**
- Now has `user_id` - user-specific overrides

**Cleared Transactions Table:**
- Now has `user_id` - user-specific cleared items

---

## 🎯 How It Works

### First Time Setup

**1. First visitor hits the site:**
- Sees setup wizard
- Creates account
- **Automatically becomes admin**
- Sets up their budget

**2. Second person visits:**
- If registration enabled → Registration page
- If registration disabled → Login only
- Creates their own account
- Sets up their own budget
- Gets their own separate data

---

## 🛡️ Admin Features

### Admin Panel (New Tab)

**Only admins see this tab!**

**System Settings:**
- Toggle "Allow New Registrations" on/off
- Save changes

**User Management:**
- View all users
- See registration dates
- Delete users (removes all their data)
- Promote to admin
- View total users count

**Statistics:**
- Total users
- Total bills across system
- Admins count

---

## 🔐 Security & Isolation

### Complete Data Isolation

**User A's data:**
- Bills: Only User A sees
- Settings: Only User A
- Forecasts: Only User A
- Cleared items: Only User A

**User B's data:**
- Completely separate
- Cannot see User A's data
- Cannot modify User A's data

**Database queries filtered by:**
```sql
WHERE user_id = [logged_in_user_id]
```

### Admin Powers

**Admins can:**
- Enable/disable registration
- View all usernames
- Delete other users
- Promote users to admin

**Admins CANNOT:**
- See other users' budget data
- Modify other users' bills
- View other users' forecasts

**Each admin has their own budget too!**

---

## 📱 User Experience

### Existing Setup (First User)
```
Visit site → Setup Wizard
→ Create account (becomes admin)
→ Configure budget
→ Start using
→ Admin tab appears
```

### New User (Registration Enabled)
```
Visit site → Registration page
→ Create account
→ Setup wizard for budget
→ Start using
→ Own separate data
```

### New User (Registration Disabled)
```
Visit site → Login page
→ Cannot register
→ Message: "Contact admin"
```

### Returning User
```
Visit site → Login page
→ Enter credentials
→ See own budget
```

---

## 🎨 UI Changes

### New Pages

**Registration Page:**
- Username field
- Password field
- Confirm password field
- Register button
- Link to login if has account

**Admin Panel (Tab):**
- Only visible to admins
- System settings section
- User management section
- Statistics section

### Updated Pages

**Login Screen:**
- Added "Create Account" link (if enabled)
- Shows message if registration disabled

**Main App:**
- Admin tab appears for admins
- Everything else same

---

## 🔧 Technical Changes

### Backend Endpoints (NEW)

```
POST   /api/auth/register         - Register new user
GET    /api/admin/users           - List all users (admin only)
DELETE /api/admin/users/:id       - Delete user (admin only)
POST   /api/admin/users/:id/admin - Toggle admin (admin only)
GET    /api/admin/settings        - Get system settings (admin only)
PUT    /api/admin/settings        - Update system settings (admin only)
GET    /api/admin/stats           - Get statistics (admin only)
```

### Backend Changes (UPDATED)

All data endpoints now filter by `user_id`:
- GET /api/settings
- PUT /api/settings
- GET /api/bills
- POST /api/bills
- PUT /api/bills/:id
- DELETE /api/bills/:id
- GET /api/overrides
- POST /api/overrides
- DELETE /api/overrides/:bill_id/:year/:month
- GET /api/cleared
- POST /api/cleared/toggle
- GET /api/export

### Frontend Changes

**index.html updated with:**
- Registration page HTML/CSS
- Admin panel HTML/CSS
- Updated auth flow
- Admin-only features
- Registration toggle handling

---

## 🎯 Use Cases

### Use Case 1: Family Budget (Shared Device)

**Setup:**
1. Dad sets up first → Becomes admin
2. Mom creates account → Own budget
3. Teen creates account → Own budget

**Benefits:**
- Each person tracks their own money
- Privacy maintained
- Dad can disable registration when done

### Use Case 2: Roommates

**Setup:**
1. First roommate → Admin
2. Enable registration
3. Other roommates create accounts
4. Each tracks their portion

**Benefits:**
- Separate bill tracking
- No confusion
- Can disable registration after all joined

### Use Case 3: Personal + Business

**Setup:**
1. You create personal account → Admin
2. Create business account
3. Switch between accounts

**Benefits:**
- Keep personal/business separate
- Different settings
- Different bills

### Use Case 4: Locked Down (Single User)

**Setup:**
1. Create your account
2. Disable registration as admin
3. Nobody else can register

**Benefits:**
- Personal use only
- Secure
- No unwanted accounts

---

## 📊 Data Migration

### For Existing Users

**If you already have data:**

The new schema includes user_id fields, but your existing data doesn't have them.

**Two options:**

**Option 1: Fresh Start (Recommended)**
```bash
# Backup old data first!
cp data/budget.db data/budget-old.db

# Delete database
rm data/budget.db

# Restart container
docker-compose restart

# New database created with new schema
# Go through setup wizard
```

**Option 2: Migrate Manually**
```sql
-- Add user_id column to existing tables
ALTER TABLE settings ADD COLUMN user_id INTEGER;
ALTER TABLE bills ADD COLUMN user_id INTEGER;
ALTER TABLE overrides ADD COLUMN user_id INTEGER;
ALTER TABLE cleared_transactions ADD COLUMN user_id INTEGER;

-- Set all existing data to user 1
UPDATE settings SET user_id = 1;
UPDATE bills SET user_id = 1;
UPDATE overrides SET user_id = 1;
UPDATE cleared_transactions SET user_id = 1;

-- Add is_admin to users
ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0;
UPDATE users SET is_admin = 1 WHERE id = 1;
```

**I recommend Option 1** since you just started testing!

---

## 🔄 Deployment

### Update on Unraid

```bash
# SSH to Unraid
ssh root@YOUR_UNRAID_IP

# Navigate to app
cd /mnt/user/appdata/budget-manager

# Backup current database (if you have data)
cp data/budget.db data/budget-backup-$(date +%Y%m%d).db

# Pull latest code
git pull

# If you want fresh start (recommended):
rm data/budget.db

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## ✅ Testing Checklist

### Test Multi-User

- [ ] First user sees setup wizard
- [ ] First user becomes admin automatically
- [ ] Admin tab appears for admin
- [ ] Admin can toggle registration
- [ ] Second user can register (when enabled)
- [ ] Second user gets setup wizard
- [ ] Second user has own budget
- [ ] User A cannot see User B's bills
- [ ] User B cannot see User A's bills
- [ ] Admin can see all usernames
- [ ] Admin can delete users
- [ ] Deleting user removes all their data

### Test Admin Controls

- [ ] Toggle registration off
- [ ] New visitor cannot register
- [ ] Toggle registration on
- [ ] New visitor can register
- [ ] View all users list
- [ ] Delete a user
- [ ] Promote user to admin
- [ ] New admin sees admin tab

### Test Data Isolation

- [ ] Create User A with bills
- [ ] Logout
- [ ] Create User B with different bills
- [ ] Logout
- [ ] Login as User A
- [ ] Only see User A's bills ✅
- [ ] Login as User B
- [ ] Only see User B's bills ✅

---

## 🎉 Summary

**You'll get:**
- ✅ Complete multi-user support
- ✅ Each user has separate budget
- ✅ Admin panel to control registrations
- ✅ User management
- ✅ Complete data isolation
- ✅ Registration page
- ✅ First user = admin
- ✅ Production-ready

**Math issues:**
- ✅ Will also fix once you tell me what's wrong

**This is a MAJOR update!**

Ready for me to create all the updated code files?
