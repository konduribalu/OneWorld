# Quick Start Guide - Updated OneWorld Application

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

## Start All Services

### Terminal 1 - User MFE (Port 4301)
```bash
cd e:\Microservices\OneWorld\frontend\user-mfe
npm install  # if not already installed
npm start
```
Wait for "Compiled successfully!" message

### Terminal 2 - Post MFE (Port 4302)
```bash
cd e:\Microservices\OneWorld\frontend\post-mfe
npm install  # if not already installed
npm start
```
Wait for "Compiled successfully!" message

### Terminal 3 - Shell Application (Port 4200)
```bash
cd e:\Microservices\OneWorld\frontend\shell
npm install  # if not already installed
npm start
```
Wait for "Application bundle generation complete."

## Access the Application

1. Open browser: `http://localhost:4200`
2. You will be redirected to login page
3. Use test credentials:
   - **Email**: `alice@example.com`
   - **Password**: `pass`
   - OR **Email**: `bob@example.com`
   - **Password**: `pass`

## Features to Test

### 1. Authentication Flow
- [ ] Login page appears with professional gradient background
- [ ] Enter credentials and click "Sign In"
- [ ] Redirects to main feed
- [ ] Left sidebar shows your avatar (circular, 72px)
- [ ] Top right shows your icon (circular, 32px)

### 2. Profile Navigation
- [ ] Click on sidebar avatar
- [ ] Full-page profile loads (no sidebars)
- [ ] See cover photo, avatar, user info
- [ ] See About, Experience, Education, Skills sections
- [ ] See Analytics, Resources cards on right
- [ ] Click "Logout" button
- [ ] Redirects back to login

### 3. Posts Feed
- [ ] Posts display in LinkedIn style
- [ ] User avatars are circular (48px) with borders
- [ ] Post content is readable with proper spacing
- [ ] Stats section shows "X reactions • Y comments"
- [ ] Action buttons: Like, Comment, Share with icons
- [ ] Hover over post card for shadow effect
- [ ] Hover over action buttons for background change
- [ ] Click Like to toggle reaction

### 4. Registration (Optional)
- [ ] Click "Join now" on login page
- [ ] Fill registration form
- [ ] Click "Create Account"
- [ ] Automatically logged in and redirected

## Styling Highlights

### User Components
- **Login/Register**: 
  - Gradient background (purple to blue)
  - White card with shadow
  - OAuth buttons with brand colors
  - Professional form styling

### Profile Page:
  - Cover photo (full width)
  - Large circular avatar (160px)
  - LinkedIn-style sections
  - Two-column layout
  - Professional typography
  - Analytics metrics
  - Skills badges

### Posts:
  - White cards with subtle borders
  - Circular avatars (48px)
  - SVG icons for actions
  - Stats section with hover
  - Professional spacing
  - Responsive design

## Color Scheme

- **Primary Blue**: `#0077B5` (LinkedIn blue)
- **Background**: `#f3f2ef` (Light gray)
- **Text Primary**: `#000000`
- **Text Secondary**: `#666666`
- **Border**: `#e0e0e0`

## Troubleshooting

### Issue: Login page not showing
**Solution**: Make sure user-mfe is running on port 4301

### Issue: Posts not loading
**Solution**: Make sure post-mfe is running on port 4302

### Issue: Styles not applied
**Solution**: 
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Rebuild MFEs with `npm run build`

### Issue: Profile not loading
**Solution**: 
1. Check browser console for errors
2. Verify user-mfe scripts are loaded
3. Check localStorage for userToken

### Issue: Already logged in but shows login
**Solution**:
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Login again

## Development Tips

### Hot Reload
- All MFEs support hot reload
- Changes to React components auto-refresh
- Changes to Angular components require manual refresh

### Debug Mode
Open browser console (F12) to see:
- Component mount/unmount messages
- API calls
- Authentication state
- Navigation events

### Clear Auth State
```javascript
// In browser console
localStorage.removeItem('userToken');
localStorage.removeItem('currentUser');
location.reload();
```

### Check Current User
```javascript
// In browser console
const userMfe = window.userMfe;
console.log('Logged in:', userMfe?.isLoggedIn());
console.log('Current user:', userMfe?.getCurrentUser());
```

## Architecture Overview

```
Browser (localhost:4200)
│
├── Shell Application (Angular)
│   ├── Routes: /, /login, /register, /profile
│   ├── AuthGuard protects authenticated routes
│   └── Loads MFEs dynamically
│
├── User MFE (React, port 4301)
│   ├── Login Component
│   ├── Register Component
│   ├── Profile Component
│   ├── UserAvatar Component (sidebar)
│   └── UserIcon Component (header)
│
└── Post MFE (React, port 4302)
    ├── PostComposer Component
    ├── PostList Component
    └── PostCard Component
```

## File Structure Reference

```
OneWorld/
├── frontend/
│   ├── user-mfe/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Login.jsx (OAuth, professional styling)
│   │   │   │   ├── Register.jsx (Full form)
│   │   │   │   ├── Profile.jsx (LinkedIn-style)
│   │   │   │   ├── UserAvatar.jsx (Sidebar)
│   │   │   │   └── UserIcon.jsx (Header)
│   │   │   ├── api/
│   │   │   │   └── mockUserApi.js
│   │   │   ├── App.js (Exports all components)
│   │   │   └── bootstrap.js (Runtime API)
│   │   └── README.md (Component docs)
│   │
│   ├── post-mfe/
│   │   ├── src/
│   │   │   ├── PostList.js (LinkedIn-style cards)
│   │   │   ├── PostComposer.js
│   │   │   ├── App.js
│   │   │   └── App.css (Professional styling)
│   │   └── package.json
│   │
│   └── shell/
│       ├── src/
│       │   └── app/
│       │       ├── login-host.component.ts (NEW)
│       │       ├── register-host.component.ts (NEW)
│       │       ├── profile-host.component.ts (NEW)
│       │       ├── accordion.component.ts (Updated)
│       │       ├── auth.guard.ts (Updated)
│       │       └── app.routes.ts (Updated)
│       └── package.json
│
└── FIXES_APPLIED.md (Detailed changes)
```

## Success Criteria

✅ All services start without errors
✅ Login page shows with professional styling
✅ Can login with test credentials
✅ Redirects to main feed after login
✅ Sidebar shows circular user avatar
✅ Header shows circular user icon
✅ Posts display with LinkedIn styling
✅ User photos in posts are circular
✅ Action buttons have icons
✅ Profile loads full-screen (no sidebars)
✅ Can logout from profile
✅ Auth persists across page refreshes

## Next Development Steps

1. Integrate real authentication API
2. Implement OAuth providers
3. Add profile editing
4. Add connection/follow features
5. Implement real-time notifications
6. Add messaging functionality
7. Improve mobile responsiveness
8. Add loading skeletons
9. Add error boundaries
10. Write unit tests

## Support

For issues or questions:
1. Check browser console for errors
2. Review FIXES_APPLIED.md for details
3. Check component README files
4. Review SHELL_INTEGRATION.md for integration details
