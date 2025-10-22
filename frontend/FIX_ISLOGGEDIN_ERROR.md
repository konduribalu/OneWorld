# Fix: "userMfe.isLoggedIn is not a function"

## The Problem

The error `userMfe.isLoggedIn is not a function` means that the user-mfe runtime API is loading, but the API object is incomplete or being overwritten.

## Root Cause

The issue was in `bootstrap.js` where the window.userMfe object initialization used:

```javascript
window.userMfe = window.userMfe || { ... }
```

This pattern can fail if `window.userMfe` exists but is set to an incomplete object or if it's being overwritten by multiple script loads.

## The Fix Applied

**File**: `frontend/user-mfe/src/bootstrap.js`

### Before:
```javascript
window.userMfe = window.userMfe || {
  async mountLogin(container, props = {}) { ... },
  async mountRegister(container, props = {}) { ... },
  // ... more methods
  isLoggedIn() { ... },
  getCurrentUser() { ... },
  logout() { ... }
};
```

### After:
```javascript
// Initialize empty object if needed
if (!window.userMfe) {
  window.userMfe = {};
}

// Use Object.assign to ensure all methods are added
Object.assign(window.userMfe, {
  async mountLogin(container, props = {}) { ... },
  async mountRegister(container, props = {}) { ... },
  // ... more methods
  isLoggedIn() { ... },
  getCurrentUser() { ... },
  logout() { ... }
});

console.log('[user-mfe] Runtime API initialized:', Object.keys(window.userMfe));
```

## Why This Works

1. **Explicit Initialization**: `if (!window.userMfe)` ensures we only create a new object if none exists
2. **Object.assign**: Merges methods into existing object instead of replacing it
3. **Debug Logging**: Logs available API methods to help troubleshoot
4. **No Short-circuit**: Doesn't rely on `||` which can fail in edge cases

## Enhanced Error Detection

The `LoginHostComponent` now validates the API before using it:

```typescript
// Verify API methods exist
if (typeof userMfe.isLoggedIn !== 'function') {
  console.error('User MFE API is incomplete. Missing isLoggedIn function.');
  console.log('Available methods:', Object.keys(userMfe));
  this.showFallback('User MFE API is incomplete. Please rebuild the user-mfe service.');
  return;
}

if (typeof userMfe.mountLogin !== 'function') {
  console.error('User MFE API is incomplete. Missing mountLogin function.');
  this.showFallback('User MFE API is incomplete. Please rebuild the user-mfe service.');
  return;
}
```

This provides clear error messages if the API is incomplete.

## How to Apply the Fix

### Step 1: Rebuild user-mfe

The user-mfe needs to be rebuilt with the updated bootstrap.js:

```powershell
# Navigate to user-mfe
cd E:\Microservices\OneWorld\frontend\user-mfe

# Stop the current running instance (Ctrl+C if running)

# Rebuild
npm start
```

### Step 2: Hard Refresh Browser

Clear any cached scripts:

1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

OR

- Press `Ctrl + Shift + R` (Chrome/Edge)
- Press `Ctrl + F5` (Firefox)

### Step 3: Verify API is Loaded

1. Open browser console (F12)
2. Type: `window.userMfe`
3. You should see an object with these methods:
   - `mountLogin`
   - `mountRegister`
   - `mountProfile`
   - `mountAvatar`
   - `mountIcon`
   - `isLoggedIn`
   - `getCurrentUser`
   - `logout`

You should also see this log message:
```
[user-mfe] Runtime API initialized: (8) ['mountLogin', 'mountRegister', ...]
```

## Complete Runtime API

The user-mfe exposes 8 methods via `window.userMfe`:

### 1. mountLogin(container, props)
Mounts the login component.
- **container**: HTML element
- **props**: `{ onLogin, onRegisterClick }`
- **returns**: Unmount function

### 2. mountRegister(container, props)
Mounts the registration component.
- **container**: HTML element
- **props**: `{ onRegister, onLoginClick }`
- **returns**: Unmount function

### 3. mountProfile(container, props)
Mounts the profile component.
- **container**: HTML element
- **props**: `{ user, onLogout }`
- **returns**: Unmount function

### 4. mountAvatar(container, props)
Mounts the user avatar (sidebar).
- **container**: HTML element
- **props**: `{ user, onClick }`
- **returns**: Unmount function

### 5. mountIcon(container, props)
Mounts the user icon (header).
- **container**: HTML element
- **props**: `{ user, onClick }`
- **returns**: Unmount function

### 6. isLoggedIn()
Checks if a user is logged in.
- **returns**: `boolean`
- **implementation**: `!!localStorage.getItem('userToken')`

### 7. getCurrentUser()
Gets the current user object.
- **returns**: `Object | null`
- **implementation**: Parses `localStorage.getItem('currentUser')`

### 8. logout()
Logs out the current user.
- **implementation**: Clears `userToken` and `currentUser` from localStorage

## Testing the Fix

### Test 1: Check API Available
```javascript
// In browser console
console.log(window.userMfe);
// Should show object with 8 methods

console.log(typeof window.userMfe.isLoggedIn);
// Should output: "function"
```

### Test 2: Test isLoggedIn
```javascript
// In browser console
console.log(window.userMfe.isLoggedIn());
// Should output: false (if not logged in) or true (if logged in)
```

### Test 3: Test Login Flow
1. Navigate to `http://localhost:4200/login`
2. Should see login form (not error message)
3. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Sign In"
5. Should redirect to feed

## Troubleshooting

### Still seeing "isLoggedIn is not a function"?

**Check 1**: Is user-mfe running?
```powershell
netstat -ano | findstr ":4301"
```
Should show LISTENING state.

**Check 2**: Are scripts loading?
- Open DevTools → Network tab
- Look for these requests:
  - `http://localhost:4301/remoteEntry.js` → Status 200
  - `http://localhost:4301/bundle.js` → Status 200

**Check 3**: Check console for initialization
Should see:
```
[user-mfe] bootstrap.js loaded.
[user-mfe] Runtime API initialized: Array(8)
```

**Check 4**: Multiple script loads?
If scripts are being loaded multiple times, the API might be incomplete:
```javascript
// In console, check how many times bootstrap loaded
document.querySelectorAll('script[src*="4301"]').length
// Should be 2 (remoteEntry.js and bundle.js)
```

### API methods are undefined

**Solution**: Clear browser cache and rebuild

```powershell
# 1. Stop user-mfe (Ctrl+C)
# 2. Clear build artifacts
rm -rf dist build node_modules/.cache

# 3. Reinstall and rebuild
npm install
npm start
```

Then hard refresh browser (Ctrl+Shift+R).

### Different error: "Cannot read property 'mountLogin' of undefined"

This means `window.userMfe` itself is undefined. Causes:
1. Scripts not loaded yet
2. Scripts failed to load (check Network tab)
3. Bootstrap.js has syntax errors

Check:
```javascript
// Console
window.userMfe
// Should be object, not undefined
```

## Files Modified

1. ✅ `frontend/user-mfe/src/bootstrap.js`
   - Changed initialization from `||` to explicit check + Object.assign
   - Added debug logging

2. ✅ `frontend/shell/src/app/login-host.component.ts`
   - Added validation for `isLoggedIn` function
   - Added validation for `mountLogin` function
   - Logs available methods if API incomplete

## Summary

The fix ensures the `window.userMfe` API is properly initialized with all required methods, including `isLoggedIn()`, `getCurrentUser()`, and `logout()`.

**To apply**: Rebuild the user-mfe service and hard refresh your browser.

The login page should now load without the "is not a function" error! 🎉
