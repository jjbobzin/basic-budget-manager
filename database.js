const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Use data directory if it exists (for Docker volumes), otherwise use current directory
const dataDir = fs.existsSync(path.join(__dirname, 'data')) 
    ? path.join(__dirname, 'data') 
    : __dirname;

// Initialize database
const db = new Database(path.join(dataDir, 'budget.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const initDatabase = () => {
    // Users table for authentication
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_admin INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // System settings (admin controls)
    db.exec(`
        CREATE TABLE IF NOT EXISTS system_settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            allow_registration INTEGER DEFAULT 1,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // User settings (one per user)
    db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            income_per_paycheck REAL NOT NULL,
            payroll_day_1 INTEGER NOT NULL,
            payroll_day_2 INTEGER NOT NULL,
            bills_account_name TEXT NOT NULL,
            bills_account_deposit REAL NOT NULL,
            personal_account_name TEXT NOT NULL,
            personal_account_deposit REAL NOT NULL,
            savings_account_1_name TEXT NOT NULL,
            savings_account_1_deposit REAL NOT NULL,
            savings_account_2_name TEXT NOT NULL,
            starting_balance REAL NOT NULL,
            setup_completed INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(user_id)
        )
    `);

    // Bills table (per user)
    db.exec(`
        CREATE TABLE IF NOT EXISTS bills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            base_amount REAL NOT NULL,
            due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
            frequency TEXT NOT NULL CHECK (frequency IN ('monthly', 'quarterly', 'semi-annual', 'annual')),
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Overrides table - for one-time amount changes (per user)
    db.exec(`
        CREATE TABLE IF NOT EXISTS overrides (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            bill_id INTEGER NOT NULL,
            year INTEGER NOT NULL,
            month INTEGER NOT NULL CHECK (month >= 0 AND month <= 11),
            amount REAL NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
            UNIQUE(bill_id, year, month)
        )
    `);

    // Cleared transactions table (per user)
    db.exec(`
        CREATE TABLE IF NOT EXISTS cleared_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            transaction_key TEXT NOT NULL,
            cleared_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(user_id, transaction_key)
        )
    `);

    // Initialize system settings if not exists
    const systemSettingsCount = db.prepare('SELECT COUNT(*) as count FROM system_settings').get();
    if (systemSettingsCount.count === 0) {
        db.prepare('INSERT INTO system_settings (id, allow_registration) VALUES (1, 1)').run();
    }

    console.log('✓ Database tables created/verified');
};

// Generate random sample data
const generateRandomData = () => {
    const billNames = [
        'Mortgage Payment', 'Rent Payment', 'Car Loan', 'Student Loan', 
        'Credit Card Payment', 'Insurance Premium', 'Utility Bill', 
        'Internet Service', 'Phone Bill', 'Streaming Services',
        'Gym Membership', 'HOA Fees', 'Storage Unit', 'Pet Care'
    ];

    const accountNames = [
        'Primary Checking', 'Bills Account', 'Personal Spending',
        'Emergency Fund', 'Savings Account', 'Investment Account',
        'High-Yield Savings', 'Money Market', 'Reserve Account'
    ];

    const frequencies = ['monthly', 'monthly', 'monthly', 'quarterly', 'semi-annual'];

    // Shuffle array helper
    const shuffle = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Random number in range
    const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randomAmount = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

    // Check if settings already exist
    const existingSettings = db.prepare('SELECT COUNT(*) as count FROM settings').get();
    
    if (existingSettings.count === 0) {
        // Insert random settings
        const shuffledAccounts = shuffle(accountNames);
        
        db.prepare(`
            INSERT INTO settings (
                id, income_per_paycheck, payroll_day_1, payroll_day_2,
                bills_account_name, bills_account_deposit,
                personal_account_name, personal_account_deposit,
                savings_account_1_name, savings_account_1_deposit,
                savings_account_2_name, starting_balance
            ) VALUES (
                1, ?, ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?
            )
        `).run(
            parseFloat(randomAmount(3000, 6000)), // income
            random(1, 15), // payroll day 1
            31, // payroll day 2 (last day)
            shuffledAccounts[0], parseFloat(randomAmount(1000, 2500)), // bills account
            shuffledAccounts[1], parseFloat(randomAmount(1000, 2500)), // personal account
            shuffledAccounts[2], parseFloat(randomAmount(100, 500)), // savings 1
            shuffledAccounts[3], // savings 2 name
            parseFloat(randomAmount(100, 1000)) // starting balance
        );

        console.log('✓ Random settings created');
    }

    // Check if bills already exist
    const existingBills = db.prepare('SELECT COUNT(*) as count FROM bills').get();
    
    if (existingBills.count === 0) {
        // Insert random bills
        const shuffledBills = shuffle(billNames).slice(0, random(6, 10));
        const insertBill = db.prepare(`
            INSERT INTO bills (name, base_amount, due_day, frequency, notes)
            VALUES (?, ?, ?, ?, ?)
        `);

        shuffledBills.forEach(billName => {
            const amount = randomAmount(50, 2000);
            const dueDay = random(1, 28);
            const frequency = frequencies[random(0, frequencies.length - 1)];
            const notes = frequency === 'monthly' ? 'Fixed' : `Paid ${frequency}`;
            
            insertBill.run(billName, amount, dueDay, frequency, notes);
        });

        console.log(`✓ ${shuffledBills.length} random bills created`);
    }
};

// Initialize and seed database
const setupDatabase = () => {
    initDatabase();
    generateRandomData();
    return db;
};

module.exports = { setupDatabase, db };
