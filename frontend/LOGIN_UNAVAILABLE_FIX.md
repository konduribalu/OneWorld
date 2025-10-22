# Login Unavailable - Quick Fix Guide

## The Problem
You're seeing the "Login Unavailable" error because the **user-mfe service is not running**.

The login component is served as a microfrontend from a separate React application that must be running on port 4301.

## Quick Fix

Open a **new terminal** and run these commands:

```powershell
# Navigate to the user-mfe folder
cd E:\Microservices\OneWorld\frontend\user-mfe

# Start the user-mfe service
npm start
```

The service should start and display:
```
Compiled successfully!

You can now view user-mfe in the browser.

  Local:            http://localhost:4301
  On Your Network:  http://192.168.x.x:4301
```

## Verify It's Working

Once the user-mfe is running, check:

1. **Open in browser**: http://localhost:4301
   - You should see a basic React page

2. **Check remote entry**: http://localhost:4301/remoteEntry.js
   - This should download a JavaScript file (not 404)

3. **Go back to login**: http://localhost:4200/login
   - The login form should now load properly

## All Required Services

For the full OneWorld application to work, you need **3 services running simultaneously**:

### Terminal 1: Shell (Main App)
```powershell
cd E:\Microservices\OneWorld\frontend\shell
npm start
```
- Runs on: http://localhost:4200
- This is your main application shell

### Terminal 2: User MFE (Login/Profile)
```powershell
cd E:\Microservices\OneWorld\frontend\user-mfe
npm start
```
- Runs on: http://localhost:4301
- Provides: Login, Register, Profile components

### Terminal 3: Post MFE (Feed/Posts)
```powershell
cd E:\Microservices\OneWorld\frontend\post-mfe
npm start
```
- Runs on: http://localhost:4302
- Provides: Post feed, post composer

## Troubleshooting

### Port Already in Use
If you see "Port 4301 is already in use":

```powershell
# Find what's using the port
netstat -ano | findstr ":4301"

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Then restart
npm start
```

### Module Not Found Errors
```powershell
# Reinstall dependencies
npm install

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Script Loading Errors in Browser
1. Open browser DevTools (F12)
2. Go to Network tab
3. Reload the page
4. Look for failed requests to localhost:4301
5. Check if CORS errors appear in Console

## What Changed?

The improved login-host component now:
- ✅ Shows a loading spinner while loading user-mfe
- ✅ Has a 5-second timeout to detect if service is down
- ✅ Provides detailed error messages with troubleshooting steps
- ✅ Includes "Retry" and "Go to Feed" buttons
- ✅ Tells you exactly what's wrong and how to fix it

## Architecture Overview

```
Browser (localhost:4200)
│
├── Shell App (Angular) - Port 4200
│   ├── Layout (header, sidebars)
│   ├── Router (/login, /profile, /)
│   └── Loads remote microfrontends
│
├── User MFE (React) - Port 4301
│   ├── Login Component
│   ├── Register Component
│   ├── Profile Component
│   └── User Avatar/Icon Components
│
└── Post MFE (React) - Port 4302
    ├── Post List
    └── Post Composer
```

## Files Modified

1. **shell/src/app/login-host.component.ts**
   - Added loading indicator
   - Added 5-second timeout
   - Improved error messages with troubleshooting steps
   - Added Retry and Go to Feed buttons

## Next Time

To avoid this issue in the future:

1. **Create a startup script** to run all services:

```powershell
# start-all.ps1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd E:\Microservices\OneWorld\frontend\shell; npm start"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd E:\Microservices\OneWorld\frontend\user-mfe; npm start"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd E:\Microservices\OneWorld\frontend\post-mfe; npm start"
```

2. **Use concurrently** (single terminal):

```json
// In root package.json
{
  "scripts": {
    "start:all": "concurrently \"npm --prefix frontend/shell start\" \"npm --prefix frontend/user-mfe start\" \"npm --prefix frontend/post-mfe start\""
  }
}
```

Then just run:
```powershell
npm run start:all
```

## Summary

**The fix is simple: Start the user-mfe service on port 4301!**

Once you do that, the login page will work perfectly with the beautiful gradient background and professional styling we created.
