const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const { setupDatabase, db } = require('./database');

const app = express();

// Get port from environment variable or command line argument or default to 54321
const PORT = process.env.PORT || process.argv[2] || 54321;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'budget-manager-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize database
setupDatabase();

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Admin middleware
const requireAdmin = (req, res, next) => {
    if (req.session && req.session.userId && req.session.isAdmin) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden - Admin access required' });
    }
};

// ==================== AUTH ENDPOINTS ====================

// Check if setup is needed
app.get('/api/setup/status', (req, res) => {
    try {
        const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
        const systemSettings = db.prepare('SELECT allow_registration FROM system_settings WHERE id = 1').get();
        
        res.json({
            needsSetup: userCount.count === 0,
            allowRegistration: systemSettings ? systemSettings.allow_registration === 1 : true,
            hasUsers: userCount.count > 0
        });
    } catch (error) {
        console.error('Setup status error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Initial setup (creates first user - becomes admin)
app.post('/api/setup/initialize', async (req, res) => {
    try {
        const { username, password, settings, bills } = req.body;

        // Check if any users exist
        const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
        if (userCount.count > 0) {
            return res.status(400).json({ error: 'Setup already completed' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert user (first user is admin)
        const insertUser = db.prepare('INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, 1)');
        const userResult = insertUser.run(username, password_hash);
        const userId = userResult.lastInsertRowid;

        // Insert settings for this user
        const insertSettings = db.prepare(`
            INSERT INTO settings (
                user_id, income_per_paycheck, payroll_day_1, payroll_day_2,
                bills_account_name, bills_account_deposit,
                personal_account_name, personal_account_deposit,
                savings_account_1_name, savings_account_1_deposit,
                savings_account_2_name, starting_balance, setup_completed
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `);

        insertSettings.run(
            userId,
            settings.income_per_paycheck,
            settings.payroll_day_1,
            settings.payroll_day_2,
            settings.bills_account_name,
            settings.bills_account_deposit,
            settings.personal_account_name,
            settings.personal_account_deposit,
            settings.savings_account_1_name,
            settings.savings_account_1_deposit,
            settings.savings_account_2_name,
            settings.starting_balance
        );

        // Insert bills if provided
        if (bills && bills.length > 0) {
            const insertBill = db.prepare(`
                INSERT INTO bills (user_id, name, base_amount, due_day, frequency, notes)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            bills.forEach(bill => {
                insertBill.run(
                    userId,
                    bill.name,
                    bill.base_amount,
                    bill.due_day,
                    bill.frequency,
                    bill.notes || ''
                );
            });
        }

        // Log the user in
        req.session.userId = userId;
        req.session.username = username;
        req.session.isAdmin = true;

        res.json({ success: true, message: 'Setup completed successfully', isAdmin: true });
    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Register new user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, settings, bills } = req.body;

        // Check if registration is allowed
        const systemSettings = db.prepare('SELECT allow_registration FROM system_settings WHERE id = 1').get();
        if (!systemSettings || systemSettings.allow_registration === 0) {
            return res.status(403).json({ error: 'Registration is currently disabled. Please contact an administrator.' });
        }

        // Check if username already exists
        const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert user (not admin)
        const insertUser = db.prepare('INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, 0)');
        const userResult = insertUser.run(username, password_hash);
        const userId = userResult.lastInsertRowid;

        // Insert settings for this user
        const insertSettings = db.prepare(`
            INSERT INTO settings (
                user_id, income_per_paycheck, payroll_day_1, payroll_day_2,
                bills_account_name, bills_account_deposit,
                personal_account_name, personal_account_deposit,
                savings_account_1_name, savings_account_1_deposit,
                savings_account_2_name, starting_balance, setup_completed
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `);

        insertSettings.run(
            userId,
            settings.income_per_paycheck,
            settings.payroll_day_1,
            settings.payroll_day_2,
            settings.bills_account_name,
            settings.bills_account_deposit,
            settings.personal_account_name,
            settings.personal_account_deposit,
            settings.savings_account_1_name,
            settings.savings_account_1_deposit,
            settings.savings_account_2_name,
            settings.starting_balance
        );

        // Insert bills if provided
        if (bills && bills.length > 0) {
            const insertBill = db.prepare(`
                INSERT INTO bills (user_id, name, base_amount, due_day, frequency, notes)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            bills.forEach(bill => {
                insertBill.run(
                    userId,
                    bill.name,
                    bill.base_amount,
                    bill.due_day,
                    bill.frequency,
                    bill.notes || ''
                );
            });
        }

        // Log the user in
        req.session.userId = userId;
        req.session.username = username;
        req.session.isAdmin = false;

        res.json({ success: true, message: 'Registration successful', isAdmin: false });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.isAdmin = user.is_admin === 1;

        res.json({ success: true, username: user.username, isAdmin: user.is_admin === 1 });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ success: true });
    });
});

// Check auth status
app.get('/api/auth/status', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ 
            authenticated: true, 
            username: req.session.username,
            isAdmin: req.session.isAdmin || false
        });
    } else {
        res.json({ authenticated: false });
    }
});

// Change password
app.post('/api/auth/change-password', requireAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
        
        const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newPasswordHash, req.session.userId);

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== ADMIN ENDPOINTS ====================

// Get system settings
app.get('/api/admin/settings', requireAdmin, (req, res) => {
    try {
        const settings = db.prepare('SELECT * FROM system_settings WHERE id = 1').get();
        res.json(settings || { allow_registration: 1 });
    } catch (error) {
        console.error('Get admin settings error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update system settings
app.put('/api/admin/settings', requireAdmin, (req, res) => {
    try {
        const { allow_registration } = req.body;
        
        db.prepare(`
            UPDATE system_settings 
            SET allow_registration = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = 1
        `).run(allow_registration ? 1 : 0);

        const updated = db.prepare('SELECT * FROM system_settings WHERE id = 1').get();
        res.json(updated);
    } catch (error) {
        console.error('Update admin settings error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all users
app.get('/api/admin/users', requireAdmin, (req, res) => {
    try {
        const users = db.prepare(`
            SELECT id, username, is_admin, created_at 
            FROM users 
            ORDER BY created_at DESC
        `).all();
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete user
app.delete('/api/admin/users/:id', requireAdmin, (req, res) => {
    try {
        const { id } = req.params;
        
        // Cannot delete yourself
        if (parseInt(id) === req.session.userId) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        // Delete user (CASCADE will delete all their data)
        db.prepare('DELETE FROM users WHERE id = ?').run(id);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Toggle admin status
app.post('/api/admin/users/:id/toggle-admin', requireAdmin, (req, res) => {
    try {
        const { id } = req.params;
        
        const user = db.prepare('SELECT is_admin FROM users WHERE id = ?').get(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newAdminStatus = user.is_admin === 1 ? 0 : 1;
        db.prepare('UPDATE users SET is_admin = ? WHERE id = ?').run(newAdminStatus, id);
        
        res.json({ success: true, is_admin: newAdminStatus });
    } catch (error) {
        console.error('Toggle admin error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get system stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
    try {
        const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
        const adminCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE is_admin = 1').get();
        const billCount = db.prepare('SELECT COUNT(*) as count FROM bills').get();
        
        res.json({
            totalUsers: userCount.count,
            totalAdmins: adminCount.count,
            totalBills: billCount.count
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== PROTECTED USER DATA ENDPOINTS ====================

// Get settings (user's own)
app.get('/api/settings', requireAuth, (req, res) => {
    try {
        const settings = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(req.session.userId);
        res.json(settings || {});
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update settings (user's own)
app.put('/api/settings', requireAuth, (req, res) => {
    try {
        const {
            income_per_paycheck, payroll_day_1, payroll_day_2,
            bills_account_name, bills_account_deposit,
            personal_account_name, personal_account_deposit,
            savings_account_1_name, savings_account_1_deposit,
            savings_account_2_name, starting_balance
        } = req.body;

        const stmt = db.prepare(`
            UPDATE settings SET
                income_per_paycheck = ?, payroll_day_1 = ?, payroll_day_2 = ?,
                bills_account_name = ?, bills_account_deposit = ?,
                personal_account_name = ?, personal_account_deposit = ?,
                savings_account_1_name = ?, savings_account_1_deposit = ?,
                savings_account_2_name = ?, starting_balance = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
        `);

        stmt.run(
            income_per_paycheck, payroll_day_1, payroll_day_2,
            bills_account_name, bills_account_deposit,
            personal_account_name, personal_account_deposit,
            savings_account_1_name, savings_account_1_deposit,
            savings_account_2_name, starting_balance,
            req.session.userId
        );

        const updated = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(req.session.userId);
        res.json(updated);
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all bills (user's own)
app.get('/api/bills', requireAuth, (req, res) => {
    try {
        const bills = db.prepare('SELECT * FROM bills WHERE user_id = ? ORDER BY due_day, name').all(req.session.userId);
        res.json(bills);
    } catch (error) {
        console.error('Get bills error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create bill (user's own)
app.post('/api/bills', requireAuth, (req, res) => {
    try {
        const { name, base_amount, due_day, frequency, notes } = req.body;
        
        const stmt = db.prepare(`
            INSERT INTO bills (user_id, name, base_amount, due_day, frequency, notes)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(req.session.userId, name, base_amount, due_day, frequency, notes || '');
        const newBill = db.prepare('SELECT * FROM bills WHERE id = ?').get(result.lastInsertRowid);
        
        res.json(newBill);
    } catch (error) {
        console.error('Create bill error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update bill (user's own only)
app.put('/api/bills/:id', requireAuth, (req, res) => {
    try {
        const { id } = req.params;
        const { name, base_amount, due_day, frequency, notes } = req.body;
        
        // Verify bill belongs to user
        const bill = db.prepare('SELECT * FROM bills WHERE id = ? AND user_id = ?').get(id, req.session.userId);
        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        
        const stmt = db.prepare(`
            UPDATE bills SET
                name = ?, base_amount = ?, due_day = ?, frequency = ?, notes = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
        `);
        
        stmt.run(name, base_amount, due_day, frequency, notes || '', id, req.session.userId);
        const updated = db.prepare('SELECT * FROM bills WHERE id = ?').get(id);
        
        res.json(updated);
    } catch (error) {
        console.error('Update bill error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete bill (user's own only)
app.delete('/api/bills/:id', requireAuth, (req, res) => {
    try {
        const { id } = req.params;
        db.prepare('DELETE FROM bills WHERE id = ? AND user_id = ?').run(id, req.session.userId);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete bill error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get overrides (user's own)
app.get('/api/overrides', requireAuth, (req, res) => {
    try {
        const overrides = db.prepare('SELECT * FROM overrides WHERE user_id = ?').all(req.session.userId);
        res.json(overrides);
    } catch (error) {
        console.error('Get overrides error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Set override (user's own)
app.post('/api/overrides', requireAuth, (req, res) => {
    try {
        const { bill_id, year, month, amount } = req.body;
        
        // Verify bill belongs to user
        const bill = db.prepare('SELECT * FROM bills WHERE id = ? AND user_id = ?').get(bill_id, req.session.userId);
        if (!bill) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        
        const stmt = db.prepare(`
            INSERT INTO overrides (user_id, bill_id, year, month, amount)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(bill_id, year, month) DO UPDATE SET amount = excluded.amount
        `);
        
        stmt.run(req.session.userId, bill_id, year, month, amount);
        res.json({ success: true });
    } catch (error) {
        console.error('Set override error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete override (user's own)
app.delete('/api/overrides/:bill_id/:year/:month', requireAuth, (req, res) => {
    try {
        const { bill_id, year, month } = req.params;
        db.prepare('DELETE FROM overrides WHERE bill_id = ? AND year = ? AND month = ? AND user_id = ?')
            .run(bill_id, year, month, req.session.userId);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete override error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get cleared transactions (user's own)
app.get('/api/cleared', requireAuth, (req, res) => {
    try {
        const cleared = db.prepare('SELECT * FROM cleared_transactions WHERE user_id = ?').all(req.session.userId);
        res.json(cleared);
    } catch (error) {
        console.error('Get cleared error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Toggle cleared status (user's own)
app.post('/api/cleared/toggle', requireAuth, (req, res) => {
    try {
        const { transaction_key } = req.body;
        
        const existing = db.prepare('SELECT * FROM cleared_transactions WHERE transaction_key = ? AND user_id = ?')
            .get(transaction_key, req.session.userId);
        
        if (existing) {
            db.prepare('DELETE FROM cleared_transactions WHERE transaction_key = ? AND user_id = ?')
                .run(transaction_key, req.session.userId);
            res.json({ cleared: false });
        } else {
            db.prepare('INSERT INTO cleared_transactions (user_id, transaction_key) VALUES (?, ?)')
                .run(req.session.userId, transaction_key);
            res.json({ cleared: true });
        }
    } catch (error) {
        console.error('Toggle cleared error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Export all data (user's own)
app.get('/api/export', requireAuth, (req, res) => {
    try {
        const settings = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(req.session.userId);
        const bills = db.prepare('SELECT * FROM bills WHERE user_id = ?').all(req.session.userId);
        const overrides = db.prepare('SELECT * FROM overrides WHERE user_id = ?').all(req.session.userId);
        const cleared = db.prepare('SELECT * FROM cleared_transactions WHERE user_id = ?').all(req.session.userId);

        res.json({
            exported_at: new Date().toISOString(),
            username: req.session.username,
            settings,
            bills,
            overrides,
            cleared_transactions: cleared
        });
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve static files (the frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Handle SPA routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`✓ Budget Manager Server running on port ${PORT}`);
    console.log(`✓ Access at: http://localhost:${PORT}`);
    console.log(`✓ Multi-user support enabled`);
});
