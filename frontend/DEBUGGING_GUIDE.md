# DEBUGGING GUIDE: "isLoggedIn is not a function" Error

## Current Situation

You're still seeing the error `userMfe.isLoggedIn is not a function` even after the fix was applied.

## Diagnostic Steps

### Step 1: Use the Test Page

I've created a comprehensive test page to diagnose the issue:

**Location**: `E:\Microservices\OneWorld\frontend\user-mfe-test.html`

**How to use**:
1. Open this file in your browser (double-click or drag to browser)
2. Click each button in order:
   - **Check Service** - Verifies user-mfe is running
   - **Load Scripts** - Loads the remoteEntry.js and bundle.js
   - **Check API** - Shows which methods are available
   - **Mount Login** - Tests if login component can mount

This will show you EXACTLY what's wrong.

### Step 2: Verify User-MFE is Running

```powershell
# Check if process is listening
netstat -ano | findstr "LISTENING" | findstr ":4301"
```

**Expected**: Should show LISTENING state
**If not**: User-mfe is not running

### Step 3: Check Browser Console

1. Open your browser to `http://localhost:4200/login`
2. Press F12 to open DevTools
3. Go to **Console** tab
4. Look for these messages:

**Good signs**:
```
[user-mfe] bootstrap.js loaded.
[user-mfe] Runtime API initialized: Array(8)
```

**Bad signs**:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
Failed to fetch
CORS error
```

### Step 4: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Reload the page
4. Look for these requests:

| URL | Expected Status | What it means |
|-----|----------------|---------------|
| `http://localhost:4301/remoteEntry.js` | 200 | ✅ MFE available |
| `http://localhost:4301/bundle.js` | 200 | ✅ Bootstrap loaded |
| `http://localhost:4301/remoteEntry.js` | 404 | ❌ File not found |
| `http://localhost:4301/remoteEntry.js` | (failed) | ❌ Service not running |

## Common Issues and Fixes

### Issue 1: User-MFE Not Running

**Symptom**: Connection refused, 000 status code

**Fix**:
```powershell
# Open NEW terminal
cd E:\Microservices\OneWorld\frontend\user-mfe
npm start
```

Wait for:
```
Compiled successfully!
webpack compiled successfully
```

### Issue 2: Old Cache

**Symptom**: API methods are undefined or old version

**Fix**:
```
1. Hard refresh browser: Ctrl + Shift + R
2. Or: Right-click refresh button → "Empty Cache and Hard Reload"
3. Or: Clear browser cache completely
```

### Issue 3: Webpack Not Compiling

**Symptom**: Service running but files not accessible

**Check terminal** where user-mfe is running. Look for:

**Good**:
```
Compiled successfully!
```

**Bad**:
```
Failed to compile
Module not found
Syntax error
```

**Fix compilation errors**:
```powershell
# Stop the service (Ctrl+C)

# Clear cache
rm -rf node_modules/.cache

# Restart
npm start
```

### Issue 4: Port Conflict

**Symptom**: Port 4301 already in use

**Fix**:
```powershell
# Find what's using port 4301
netstat -ano | findstr ":4301"

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Restart user-mfe
cd E:\Microservices\OneWorld\frontend\user-mfe
npm start
```

### Issue 5: Bootstrap.js Not Loading

**Symptom**: window.userMfe is undefined

**Fix**: Check if bootstrap.js has errors

```powershell
# Navigate to user-mfe
cd E:\Microservices\OneWorld\frontend\user-mfe

# Check syntax
node -c src/bootstrap.js
```

If errors appear, there's a syntax issue in bootstrap.js.

### Issue 6: Multiple Script Loads

**Symptom**: API is partially loaded

**Check in console**:
```javascript
// Count how many times scripts loaded
document.querySelectorAll('script[src*="4301"]').length
```

Should be 2 (remoteEntry.js + bundle.js). If more, there might be duplicate loads.

**Fix**: Hard refresh browser

## Manual Verification

### Test 1: Can you access the service?

Open in browser:
```
http://localhost:4301
```

**Expected**: Should see a React app or HTML page
**Actual**: If you see "Cannot connect" → Service not running

### Test 2: Can you access remoteEntry.js?

Open in browser:
```
http://localhost:4301/remoteEntry.js
```

**Expected**: Should download/show JavaScript file
**Actual**: If 404 or connection error → Problem with webpack build

### Test 3: Check window.userMfe in console

Open browser console (F12) and type:
```javascript
window.userMfe
```

**Expected**:
```javascript
{
  mountLogin: ƒ,
  mountRegister: ƒ,
  mountProfile: ƒ,
  mountAvatar: ƒ,
  mountIcon: ƒ,
  isLoggedIn: ƒ,
  getCurrentUser: ƒ,
  logout: ƒ
}
```

**If undefined**: Scripts not loaded
**If missing methods**: Old cache or partial load

### Test 4: Check specific method

```javascript
typeof window.userMfe.isLoggedIn
```

**Expected**: `"function"`
**Actual**: `"undefined"` → API not properly initialized

## The Nuclear Option

If nothing else works, do a complete rebuild:

```powershell
# 1. Stop ALL running services (Ctrl+C in all terminals)

# 2. Clean user-mfe
cd E:\Microservices\OneWorld\frontend\user-mfe
rm -rf node_modules dist build .cache
npm install

# 3. Clean shell
cd E:\Microservices\OneWorld\frontend\shell
rm -rf node_modules dist .angular
npm install

# 4. Start user-mfe
cd E:\Microservices\OneWorld\frontend\user-mfe
npm start
# Wait for "Compiled successfully"

# 5. In NEW terminal, start shell
cd E:\Microservices\OneWorld\frontend\shell
npm start
# Wait for "Compiled successfully"

# 6. Clear browser cache completely
# Settings → Privacy → Clear browsing data → Cached images and files

# 7. Navigate to http://localhost:4200/login
```

## What to Report Back

Please run the test HTML page and tell me:

1. **Check Service** - Does it show green (✅) or red (❌)?
2. **Load Scripts** - Does it load successfully?
3. **Check API** - Which methods show ✅ and which show ❌?
4. **Browser Console** - Copy/paste any error messages

Also check:
```powershell
# Show me what's running
netstat -ano | findstr "LISTENING" | findstr "4200 4301 4302"
```

With this information, I can give you a precise fix!

## Quick Checklist

- [ ] User-mfe service is running (check with netstat)
- [ ] Webpack compiled successfully (check terminal output)
- [ ] Browser cache cleared (Ctrl+Shift+R)
- [ ] http://localhost:4301 is accessible in browser
- [ ] http://localhost:4301/remoteEntry.js returns a file (not 404)
- [ ] Browser console shows "[user-mfe] Runtime API initialized"
- [ ] window.userMfe exists in browser console
- [ ] window.userMfe.isLoggedIn is a function (check with typeof)

If ALL checkboxes are ✅ and it still doesn't work, there's something else going on that we need to investigate.
