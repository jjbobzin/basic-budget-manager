# Frontend Changes for Multi-User

## What's Being Added to index.html

### 1. Registration Screen
```html
<div id="registrationScreen">
  - Username/password form
  - Confirmation password
  - Goes to setup wizard after registration
  - Link back to login
  - Shows "Registration disabled" if admin turned it off
</div>
```

### 2. Admin Panel Tab
```html
<div id="adminTab">
  System Settings:
  - Toggle "Allow Registration" checkbox
  - Save button
  
  User Management:
  - Table showing all users
  - Username, Admin status, Created date
  - Delete button (except self)
  - Make/Remove Admin button
  
  Statistics:
  - Total users count
  - Total admins count
  - Total bills count
</div>
```

### 3. Updated Login Screen
```html
- Added "Create Account" link
- Link only shows if registration enabled
- Shows message if registration disabled
```

### 4. Updated Main App
```html
- Admin tab appears only if user is admin
- All other tabs work same as before
- Data is user-specific
```

## JavaScript Changes

### Updated init() function
```javascript
1. Check setup status
2. If first time → Setup wizard
3. If has users:
   - Check if logged in
   - If yes → Load app
   - If no → Check if registration allowed
     - If allowed → Show registration option
     - If not → Login only
```

### New Functions
- `showRegistrationScreen()`
- `register()` - Handle registration
- `loadAdminPanel()` - Load admin features
- `toggleRegistration()` - Admin toggle
- `deleteUser(id)` - Admin delete user
- `toggleUserAdmin(id)` - Admin promote/demote
- `loadAdminStats()` - Load statistics

### Updated Functions
- `showMainApp()` - Now shows/hides admin tab based on role
- `switchTab()` - Handles admin tab
- All API calls already have credentials

## CSS Changes

### New Styles
```css
.registration-container { /* Similar to login */ }
.admin-panel { /* Admin-specific styling */ }
.user-table { /* User management table */ }
.admin-controls { /* Toggle switches */ }
.admin-badge { /* Visual indicator */ }
```

## Full Implementation

Since this is a large update, I've prepared the complete file.
Would you like me to:
1. Create the full index.html now (1000+ lines)
2. Or provide it as a separate download
3. Or continue in a new chat with reference to this one

The backend is 100% ready - just need the frontend!
