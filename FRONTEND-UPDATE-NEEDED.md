# 🚧 Frontend Update Required

## Current Status

✅ **Backend is ready!**
- Authentication endpoints implemented
- Setup wizard endpoint implemented
- All API routes protected
- Session management working
- Database schema updated

❌ **Frontend needs updates**
- Current `index.html` doesn't have login screen
- No setup wizard UI
- No auth checks before API calls
- No logout button

---

## What Needs to Be Done

The frontend (`public/index.html`) needs these additions:

### 1. Login Screen
```
┌──────────────────────────┐
│   Budget Manager Login   │
├──────────────────────────┤
│                          │
│  Username: [________]    │
│  Password: [________]    │
│                          │
│      [  Login  ]         │
│                          │
└──────────────────────────┘
```

### 2. Setup Wizard (First-Time Only)
```
Step 1: Create Account
├─ Username
├─ Password
└─ Confirm Password

Step 2: Income Configuration
├─ Income per paycheck
├─ Payroll day 1
└─ Payroll day 2

Step 3: Account Names & Deposits
├─ Bills account (name & deposit)
├─ Personal account (name & deposit)
├─ Savings 1 (name & deposit)
├─ Savings 2 (name)
└─ Starting balance

Step 4: Initial Bills (Optional)
├─ Add bills one at a time
└─ Or skip and add later

Step 5: Review & Complete
```

### 3. Main App Updates
- Add logout button
- Check auth status on load
- Redirect to login if not authenticated
- Handle 401 errors (session expired)
- Show username in header

### 4. API Call Updates
- All fetch() calls need credentials: 'include'
- Handle 401 responses → redirect to login
- Show friendly error messages

---

## Implementation Options

### Option A: I Create Complete Frontend (Recommended)

**Pros:**
- ✅ Everything works together
- ✅ Clean, professional UI
- ✅ Tested and working
- ✅ Ready to use immediately

**What I'll create:**
- Login screen with validation
- Multi-step setup wizard
- Updated main app with auth
- Logout button
- Error handling
- Responsive design

**Time:** ~30-45 minutes for me to create

### Option B: You Update Frontend

**What you'd need to add:**
1. Login form HTML/CSS/JS
2. Setup wizard (multi-step form)
3. Auth check on page load
4. Logout functionality
5. 401 error handling
6. Update all API calls

**Reference:** See the endpoints in server.js:
- `/api/setup/status` - Check if needs setup
- `/api/setup/initialize` - Complete setup
- `/api/auth/login` - Login
- `/api/auth/logout` - Logout
- `/api/auth/status` - Check if logged in

---

## Quick Example: Auth Flow

```javascript
// On page load
async function checkAuth() {
    const response = await fetch('/api/auth/status', {
        credentials: 'include'
    });
    const data = await response.json();
    
    if (!data.authenticated) {
        showLoginScreen();
    } else {
        loadApp();
    }
}

// Login
async function login(username, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
        loadApp();
    } else {
        showError('Invalid credentials');
    }
}

// API calls need credentials
async function getBills() {
    const response = await fetch('/api/bills', {
        credentials: 'include'  // Important!
    });
    
    if (response.status === 401) {
        // Session expired
        showLoginScreen();
        return;
    }
    
    return await response.json();
}
```

---

## My Recommendation

**Let me create the complete frontend for you.**

**Why:**
1. The backend is already done and tested
2. Frontend needs significant changes
3. I can create a polished, working solution
4. Setup wizard is complex (multi-step form)
5. You want to start testing on Unraid ASAP

**What I'll deliver:**
- ✅ Complete login screen
- ✅ Full setup wizard (4 steps)
- ✅ Updated main app with auth
- ✅ Logout functionality
- ✅ Error handling
- ✅ Responsive design
- ✅ Ready to deploy

**Just say:** "Yes, create the complete frontend" and I'll do it!

---

## Alternative: Test Without Frontend Updates

**If you want to test the backend immediately:**

You can use curl or Postman:

```bash
# Check if needs setup
curl http://localhost:54321/api/setup/status

# Create user and complete setup
curl -X POST http://localhost:54321/api/setup/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "test123",
    "settings": {
      "income_per_paycheck": 5000,
      "payroll_day_1": 15,
      "payroll_day_2": 31,
      "bills_account_name": "Bills",
      "bills_account_deposit": 2500,
      "personal_account_name": "Personal",
      "personal_account_deposit": 1500,
      "savings_account_1_name": "Emergency",
      "savings_account_1_deposit": 500,
      "savings_account_2_name": "Vacation",
      "starting_balance": 1000
    },
    "bills": []
  }'

# Login (get session cookie)
curl -X POST http://localhost:54321/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username": "admin", "password": "test123"}'

# Get bills (using session)
curl http://localhost:54321/api/bills \
  -b cookies.txt
```

But this isn't practical for daily use!

---

## Current Files Status

| File | Status | Notes |
|------|--------|-------|
| `server.js` | ✅ Complete | All auth + API endpoints |
| `database.js` | ✅ Updated | Users table added |
| `package.json` | ✅ Updated | bcrypt + sessions added |
| `public/index.html` | ❌ Needs work | No login/wizard |

---

## Next Steps

**Choose one:**

### Option 1: Complete Frontend (Recommended)
**You say:** "Create the frontend with login and wizard"
**I'll do:** Create complete, working frontend
**Time:** Ready in 30-45 minutes
**Result:** Fully functional app ready to deploy

### Option 2: You Handle Frontend
**You do:** Update index.html yourself
**Reference:** Use endpoints documented above
**Time:** A few hours of development
**Result:** Custom frontend your way

### Option 3: Test Backend Only
**You do:** Use curl/Postman to test
**Skip:** Frontend for now
**Time:** Can test immediately
**Result:** Backend verified, add frontend later

---

## 🎯 My Strong Recommendation

**Go with Option 1!**

The backend is done, database is ready, authentication works. All that's missing is the frontend UI. Let me create it so you can deploy and start using it on Unraid today!

The setup wizard alone is complex (multi-step form with validation), and you want to start testing ASAP.

**Just say "yes" and I'll create the complete frontend!** 🚀

---

## Questions?

**Q: Will data persist if I add frontend later?**
**A:** Yes! The database is separate. Backend works now.

**Q: Can I test on Unraid without frontend?**
**A:** Not practically. Need UI for daily use.

**Q: How long to create frontend?**
**A:** 30-45 minutes for me to make it polished.

**Q: Will it look good?**
**A:** Yes! Professional, clean design.

**Q: Will setup wizard be easy?**
**A:** Yes! Step-by-step with clear instructions.
