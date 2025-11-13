# Budget Manager - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Node.js (if not already installed)

**Download Node.js:**
Visit https://nodejs.org/ and download the LTS version for your operating system.

**Verify installation:**
Open terminal/command prompt and run:
```bash
node --version
npm --version
```

You should see version numbers for both.

---

### Step 2: Install Dependencies

Open terminal in the `budget-app-server` folder and run:

```bash
npm install
```

Wait for all packages to download and install. This may take 1-2 minutes.

---

### Step 3: Start the Server

Run:
```bash
npm start
```

You'll see a box showing the server is running:
```
╔════════════════════════════════════════════╗
║     Budget Manager Server                  ║
╠════════════════════════════════════════════╣
║  Server running on: http://localhost:3000  ║
║                                            ║
║  Access from other devices on network:     ║
║  http://[your-ip]:3000                     ║
║                                            ║
║  Press Ctrl+C to stop                      ║
╚════════════════════════════════════════════╝
```

**Open your browser and go to:** `http://localhost:3000`

---

## ✅ You're Done!

The app will open with random sample data. You can:
- Edit all the numbers and names to match your budget
- Add/delete bills as needed
- Click ⚙️ Settings to customize account names
- Click "Reset to Random" to get new sample data

---

## 🎯 Quick Tips

### Change the Port

If port 3000 is already in use:
```bash
npm start 8080
```

### Access from Your Phone

1. Find your computer's IP address:
   - **Windows**: Run `ipconfig` in command prompt
   - **Mac**: Run `ifconfig` in terminal
   - **Linux**: Run `ip addr` in terminal

2. Look for your local IP (usually starts with 192.168.x.x)

3. On your phone's browser, go to: `http://192.168.x.x:3000`
   (Replace with your actual IP)

### Export Your Data Regularly

Click "Export Data" to save a backup JSON file. Store it somewhere safe!

### Customize Everything

1. Click ⚙️ Settings to edit account names
2. Edit bills in the Budget Allocation tab
3. Set your actual income and payroll dates
4. Adjust deposit amounts

---

## 📱 Sample Workflow

1. **Set Your Income**: Enter your actual paycheck amount
2. **Add Your Bills**: Delete sample bills, add your real ones
3. **Set Deposits**: Adjust how much goes to each account
4. **Check Running Balance**: See your 12-month forecast
5. **Override Amounts**: Click bills in Running Balance to set one-time amounts (like higher electric in summer)
6. **Mark Cleared**: Click ✕ next to transactions as they clear your bank

---

## ⚠️ Important Notes

- **Stop the server**: Press `Ctrl+C` in the terminal
- **Restart the server**: Run `npm start` again
- **Database location**: `budget.db` file in the app folder
- **Backup your data**: Use Export button regularly!

---

## 🆘 Need Help?

**Can't install npm packages?**
→ Make sure Node.js is installed: `node --version`

**Port already in use?**
→ Try a different port: `npm start 8080`

**Can't connect from phone?**
→ Check that both devices are on the same WiFi network

**Want to start fresh?**
→ Click "Reset to Random" or delete `budget.db` file

---

## 📖 Full Documentation

See `README.md` for complete documentation including:
- Detailed features explanation
- API endpoints
- Troubleshooting guide
- Security considerations
- Development guide

---

## 🎉 Enjoy!

Your budget is now managed professionally with:
- ✅ Automatic calculations
- ✅ 12-month forecasting
- ✅ Cross-device access
- ✅ Persistent storage
- ✅ Full customization
