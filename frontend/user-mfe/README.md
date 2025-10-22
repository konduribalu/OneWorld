# User MFE - LinkedIn-Style User Components

A React-based microfrontend that provides user authentication and profile management components for the OneWorld application.

## Architecture

This MFE follows a **no internal routing** architecture. All components are designed to be mounted independently by the shell application, which controls navigation and the authentication flow.

## Components

### 1. **Login** (`src/components/Login.jsx`)
Professional login page with:
- Email/password authentication
- OAuth provider support (Google, LinkedIn, GitHub)
- Toggle to Registration view
- Error handling and loading states

**Usage:**
```javascript
window.userMfe.mountLogin(container, {
  onLogin: (user) => { /* handle successful login */ },
  onRegisterClick: () => { /* switch to register view */ }
});
```

### 2. **Register** (`src/components/Register.jsx`)
Comprehensive registration form with:
- First name, last name, email
- Job title and location (optional)
- Password and confirmation
- Terms & conditions acceptance
- Toggle to Login view

**Usage:**
```javascript
window.userMfe.mountRegister(container, {
  onRegister: (user) => { /* handle successful registration */ },
  onLoginClick: () => { /* switch to login view */ }
});
```

### 3. **Profile** (`src/components/Profile.jsx`)
Full LinkedIn-style profile page with:
- Cover photo and large avatar
- User identity (name, title, location, connections)
- About section with bio
- Experience timeline
- Education
- Skills badges
- Analytics card (private metrics)
- Resources and featured content
- Edit profile and logout actions

**Usage:**
```javascript
window.userMfe.mountProfile(container, {
  user: currentUser,
  onLogout: () => { /* handle logout */ }
});
```

### 4. **UserAvatar** (`src/components/UserAvatar.jsx`)
Compact sidebar card showing:
- User photo
- Name, title, location
- Clickable to view full profile

**Usage:**
```javascript
window.userMfe.mountAvatar(container, {
  user: currentUser,
  onClick: () => { /* navigate to profile */ }
});
```

### 5. **UserIcon** (`src/components/UserIcon.jsx`)
Top-right header user icon showing:
- Small circular avatar
- User name (hidden on mobile)
- Dropdown indicator

**Usage:**
```javascript
window.userMfe.mountIcon(container, {
  user: currentUser,
  onClick: () => { /* open menu or navigate */ }
});
```

## Runtime API

The MFE exposes a global `window.userMfe` object with the following methods:

### Authentication & State
- `isLoggedIn()` - Returns boolean indicating if user is logged in
- `getCurrentUser()` - Returns current user object from localStorage
- `logout()` - Clears user token and data from localStorage

### Component Mounting
- `mountLogin(container, props)` - Mount Login component
- `mountRegister(container, props)` - Mount Register component
- `mountProfile(container, props)` - Mount Profile component
- `mountAvatar(container, props)` - Mount UserAvatar component
- `mountIcon(container, props)` - Mount UserIcon component
- `unmount(container)` - Unmount React component from container

All mount methods return an unmount function for cleanup.

## Authentication Flow

The shell should implement this flow:

1. **Initial Load**: Check `userMfe.isLoggedIn()`
2. **Not Logged In**: Mount Login component via `mountLogin()`
3. **Login Success**: Store user data and redirect to main app
4. **Registration**: Mount Register component via `mountRegister()`
5. **Logged In**: Display UserAvatar (sidebar) and UserIcon (header)
6. **Profile View**: Mount Profile component via `mountProfile()`
7. **Logout**: Call `userMfe.logout()` and redirect to login

## Data Structure

### User Object
```javascript
{
  id: string,
  name: string,
  email: string,
  title: string,
  location: string,
  bio: string,
  photo: string (URL),
  connections: number,
  followers: array,
  following: array
}
```

## Styling

All components use modular CSS:
- `Login.css` - Login page styles
- `Register.css` - Registration page styles
- `Profile.css` - Profile page styles (LinkedIn-inspired)
- `UserAvatar.css` - Sidebar avatar card
- `UserIcon.css` - Header user icon

Colors follow LinkedIn's design:
- Primary: `#0077B5`
- Background: `#f3f2ef`
- Text: `#000` (headings), `#666` (secondary)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Integration with Shell

The shell application should:

1. Load the MFE's remoteEntry.js
2. Wait for `window.userMfe` to be available
3. Use `isLoggedIn()` to determine initial view
4. Mount Login if not logged in
5. Mount UserAvatar and UserIcon if logged in
6. Handle navigation between Login, Register, and Profile
7. Protect routes with auth guard using `isLoggedIn()`

### Example Shell Integration

```typescript
// Check auth status
const isLoggedIn = window.userMfe?.isLoggedIn();

if (!isLoggedIn) {
  // Mount login
  await window.userMfe.mountLogin(container, {
    onLogin: (user) => {
      // Redirect to main app
      this.router.navigate(['/feed']);
    },
    onRegisterClick: () => {
      // Switch to register view
      await window.userMfe.mountRegister(container, {
        onRegister: (user) => {
          this.router.navigate(['/feed']);
        },
        onLoginClick: () => {
          // Switch back to login
        }
      });
    }
  });
} else {
  // Mount avatar in sidebar
  await window.userMfe.mountAvatar(sidebarContainer, {
    user: window.userMfe.getCurrentUser(),
    onClick: () => {
      this.router.navigate(['/profile']);
    }
  });
  
  // Mount icon in header
  await window.userMfe.mountIcon(headerContainer, {
    user: window.userMfe.getCurrentUser(),
    onClick: () => {
      this.router.navigate(['/profile']);
    }
  });
}
```

## Features

- ✅ No internal routing - shell controls navigation
- ✅ OAuth provider support (Google, LinkedIn, GitHub)
- ✅ LinkedIn-inspired UI design
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Local storage for auth persistence
- ✅ Comprehensive profile view
- ✅ Modular component architecture
- ✅ Clean runtime API
- ✅ Error handling and loading states
- ✅ Accessibility features

## TODO

- [ ] Connect to real authentication API
- [ ] Implement actual OAuth flows
- [ ] Add profile editing functionality
- [ ] Add avatar upload
- [ ] Add experience/education CRUD operations
- [ ] Add skills endorsement
- [ ] Add connections management
- [ ] Implement real analytics
- [ ] Add i18n support
