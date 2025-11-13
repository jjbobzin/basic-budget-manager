# Budget Manager - Server Application

A full-stack personal budget management application with SQLite database backend.

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get running in 3 steps
- **[Docker Deployment](DOCKER.md)** - Docker and Unraid setup
- **[GitHub Setup](GITHUB.md)** - Version control and collaboration
- **[Change Log](CHANGES.md)** - What's new in v2.0

## Features

- ✅ **Database Persistence**: SQLite database stores all data permanently
- ✅ **Cross-Browser/Device Access**: Access from any browser on your network
- ✅ **Customizable Account Names**: All account names are fully editable
- ✅ **Random Sample Data**: Fresh random data for sharing/demo purposes
- ✅ **Bill Frequency Support**: Monthly, quarterly, semi-annual, and annual bills
- ✅ **Monthly Reserve System**: Automatically reserves money for non-monthly bills
- ✅ **Running Balance Forecast**: 12-month cash flow projection
- ✅ **Override System**: One-time amount changes for specific months
- ✅ **Clear Transactions**: Mark transactions as cleared (auto-hides past items)
- ✅ **Data Export**: Backup your data as JSON
- ✅ **Configurable Port**: Run on any port you choose

## Installation

### Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Local Development

**Step 1: Install Dependencies**

Open a terminal in the `budget-app-server` directory and run:

```bash
npm install
```

This will install:
- express (web server)
- better-sqlite3 (database)
- cors (cross-origin support)
- body-parser (JSON handling)

**Step 2: Start the Server**

**Default port (3000):**
```bash
npm start
```

**Custom port:**
```bash
npm start 8080
```

Or:
```bash
PORT=8080 npm start
```

**Step 3: Access the Application**

Open your browser and go to:
- Local: `http://localhost:3000` (or your custom port)
- From other devices on network: `http://[your-ip]:3000`

### Docker Deployment

**Quick start with Docker Compose:**

```bash
docker-compose up -d
```

**Or with Docker CLI:**

```bash
docker build -t budget-manager .
docker run -d -p 3000:3000 -v ./data:/app/data budget-manager
```

**For complete Docker and Unraid instructions, see [DOCKER.md](DOCKER.md)**

### Unraid Deployment

**Method 1: Docker Compose** (Recommended)

1. Upload files to `/mnt/user/appdata/budget-manager/`
2. Use Compose Manager plugin
3. Point to `docker-compose.yml`
4. Compose Up!

**Method 2: Docker Template**

1. Use the included `unraid-template.xml`
2. Or manually add container via Docker tab

**Full Unraid guide: [DOCKER.md](DOCKER.md)**

## Installation

### Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Step 1: Install Dependencies

Open a terminal in the `budget-app-server` directory and run:

```bash
npm install
```

This will install:
- express (web server)
- better-sqlite3 (database)
- cors (cross-origin support)
- body-parser (JSON handling)

### Step 2: Start the Server

**Default port (3000):**
```bash
npm start
```

**Custom port:**
```bash
npm start 8080
```

Or:
```bash
PORT=8080 npm start
```

### Step 3: Access the Application

Open your browser and go to:
- Local: `http://localhost:3000` (or your custom port)
- From other devices on network: `http://[your-ip]:3000`

To find your IP address:
- **Windows**: `ipconfig` (look for IPv4 Address)
- **Mac/Linux**: `ifconfig` or `ip addr` (look for inet address)

## Usage

### Budget Allocation Tab

This tab shows you:
- How much to deposit into each account per paycheck
- Total monthly bills obligation (including reserves for non-monthly bills)
- Whether your fixed deposit covers all bills
- Surplus or deficit amount
- Remainder going to savings

**Features:**
- Edit income and payroll dates
- Customize account deposit amounts
- Add/edit/delete bills
- Set bill frequency (monthly, quarterly, semi-annual, annual)
- View annual projections

### Running Balance Tab

This tab shows:
- 12-month cash flow forecast
- Day-by-day running balance
- Color-coded balance warnings:
  - 🟢 Green (>$500): Healthy balance
  - 🟡 Yellow ($200-$500): Moderate balance
  - 🔴 Red (<$200): Low balance warning

**Features:**
- Set starting balance
- Click bill names to override amounts for specific months
- Click ✕ to mark transactions as cleared
- Transactions >4 days old auto-hide when cleared
- View monthly reserves for non-monthly bills

### Settings

Click the ⚙️ Settings button to:
- Customize all account names (Bills Account, Personal Account, etc.)
- Personalize the app for your specific bank accounts

### Data Management

**Export Data:**
- Click "Export Data" to download a JSON backup
- Store this file safely (Dropbox, Google Drive, etc.)
- Use it to restore data or migrate to a new installation

**Reset to Random:**
- Click "Reset to Random" to generate new sample data
- Useful for demoing the app or starting fresh
- **WARNING**: This deletes all existing data!

## How It Works

### Database Structure

The app uses SQLite with these tables:

1. **settings** - Stores income, payroll dates, account names, deposits
2. **bills** - Stores bill details (name, amount, due day, frequency)
3. **overrides** - Stores one-time amount changes for specific months
4. **cleared_transactions** - Tracks which transactions have been cleared

### Bill Frequency Logic

**Monthly bills:**
- Appear every month on their due date
- Full amount deducted from running balance

**Quarterly bills (Feb, May, Aug, Nov):**
- Monthly reserve: Amount ÷ 3
- Deducts reserve every month
- Shows actual payment in payment months

**Semi-annual bills (Mar, Sep):**
- Monthly reserve: Amount ÷ 6
- Deducts reserve every month
- Shows actual payment in payment months

**Annual bills (Aug):**
- Monthly reserve: Amount ÷ 12
- Deducts reserve every month
- Shows actual payment in August

### Running Balance Calculation

```
Starting Balance: $455.64

Day 15: Payroll +$1,400 = $1,855.64
Day 15: AmexLoan -$200 = $1,655.64
Day 18: Internet -$95 = $1,560.64
Day 25: Electric -$250 = $1,310.64
Day 28: Water -$156 = $1,154.64
Day 31: Payroll +$1,400 = $2,554.64

(Next month continues from $2,554.64...)
```

## Configuration

### Port Configuration

Three ways to set the port:

1. **Command line argument:**
   ```bash
   npm start 8080
   ```

2. **Environment variable:**
   ```bash
   PORT=8080 npm start
   ```

3. **Edit package.json:**
   ```json
   "scripts": {
     "start": "PORT=8080 node server.js"
   }
   ```

### Account Names

All account names are customizable:
1. Click ⚙️ Settings
2. Edit any account name
3. Changes reflect immediately throughout the app

### Random Data Generation

The app generates random sample data on first run:
- Income: $3,000 - $6,000 per paycheck
- Bills: 6-10 random bills with realistic names
- Amounts: $50 - $2,000 per bill
- Account names: Randomly selected from a pool

## Sharing the App

To share this app with others:

1. **Share the code:**
   - Zip the entire `budget-app-server` directory
   - Send to others (email, USB drive, etc.)
   - They run `npm install` then `npm start`

2. **Network access:**
   - Others on your network can access: `http://[your-ip]:3000`
   - Each user sees the same data (shared database)

3. **Separate installations:**
   - Each person installs separately = separate databases
   - Use Export/Import to share specific budget templates

## Troubleshooting

### Port already in use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:** Use a different port
```bash
npm start 8080
```

### Database locked

```
Error: database is locked
```

**Solution:** Only one process can write to SQLite at once. Close other instances of the app.

### Module not found

```
Error: Cannot find module 'express'
```

**Solution:** Run `npm install` again

### Can't connect from other devices

**Checklist:**
1. Is the server running? (Check terminal)
2. Are you using the correct IP address?
3. Is firewall blocking the port?
4. Are devices on the same network?

**Windows Firewall:**
- Go to Windows Defender Firewall
- Allow an app through firewall
- Add Node.js

**Mac Firewall:**
- System Preferences > Security & Privacy > Firewall
- Add Node.js to allowed apps

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses nodemon to auto-restart on file changes.

### Database Location

The SQLite database file is:
```
budget-app-server/budget.db
```

You can:
- Back it up by copying this file
- Delete it to start fresh (app will recreate with random data)
- Open it with SQLite browser tools for direct access

### API Endpoints

The server exposes these REST APIs:

**Settings:**
- GET `/api/settings` - Get settings
- PUT `/api/settings` - Update settings

**Bills:**
- GET `/api/bills` - Get all bills
- POST `/api/bills` - Create bill
- PUT `/api/bills/:id` - Update bill
- DELETE `/api/bills/:id` - Delete bill

**Overrides:**
- GET `/api/overrides` - Get all overrides
- POST `/api/overrides` - Create/update override
- DELETE `/api/overrides/:bill_id/:year/:month` - Delete override

**Cleared Transactions:**
- GET `/api/cleared` - Get cleared transactions
- POST `/api/cleared` - Mark transaction cleared
- DELETE `/api/cleared/:transaction_key` - Unmark transaction

**Data Management:**
- GET `/api/export` - Export all data as JSON
- POST `/api/reset` - Reset to new random data

## Security Considerations

- **Local network only**: App is designed for use on local network
- **No authentication**: Anyone with network access can view/edit data
- **No encryption**: Data stored in plaintext SQLite database
- **Backup important**: Regular exports recommended

For production use with internet access, you would need:
- User authentication (login system)
- HTTPS encryption
- Database encryption
- Rate limiting
- CORS restrictions

## System Requirements

- **Memory**: ~50 MB RAM
- **Disk**: ~5 MB (app + database)
- **CPU**: Minimal (any modern processor)
- **OS**: Windows, Mac, Linux (Node.js supported)

## License

MIT License - Free to use, modify, and share.

## Support

For issues or questions:
1. Check this README
2. Review error messages in terminal
3. Check Node.js and npm are correctly installed
4. Try a fresh installation

## Version History

**v2.0.0** - Server-based with SQLite
- Added database persistence
- Added cross-browser/device access
- Added customizable account names
- Added random data generation
- Fixed Apple Savings calculation bug

**v1.0.0** - localStorage version
- Single HTML file
- Browser localStorage
- Fixed calculations
