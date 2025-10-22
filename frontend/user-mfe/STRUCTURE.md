# User MFE Component Structure

## Component Hierarchy

```
user-mfe/
├── Login Component
│   ├── Email/Password Form
│   ├── OAuth Buttons (Google, LinkedIn, GitHub)
│   └── Link to Register
│
├── Register Component
│   ├── Personal Info (First/Last Name, Email)
│   ├── Professional Info (Title, Location)
│   ├── Password & Confirmation
│   ├── Terms Agreement
│   └── Link to Login
│
├── Profile Component
│   ├── Header Section
│   │   ├── Cover Photo
│   │   ├── Large Avatar
│   │   ├── User Identity (Name, Title, Location)
│   │   └── Action Buttons (Edit, Logout)
│   │
│   ├── Left Column
│   │   ├── About Card
│   │   ├── Experience Card (Timeline)
│   │   ├── Education Card
│   │   └── Skills Card (Badges)
│   │
│   └── Right Column
│       ├── Analytics Card (Private Metrics)
│       ├── Resources Card
│       └── Featured Card
│
├── UserAvatar Component (Sidebar)
│   ├── User Photo (72x72)
│   ├── Name
│   ├── Title
│   └── Location
│
└── UserIcon Component (Header)
    ├── Small Avatar (32x32)
    ├── User Name
    └── Dropdown Indicator
```

## Shell Integration Points

```
Shell Application
│
├── Routes
│   ├── /login          → LoginHostComponent → userMfe.mountLogin()
│   ├── /register       → RegisterHostComponent → userMfe.mountRegister()
│   ├── /profile        → ProfileHostComponent → userMfe.mountProfile()
│   └── /feed (+ others) → MainLayoutComponent (with sidebar & header)
│
├── Sidebar
│   └── userMfeHost     → userMfe.mountAvatar()
│
└── Header
    └── userIconHost    → userMfe.mountIcon()
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Authentication Flow                 │
└─────────────────────────────────────────────────────────────────┘

1. Initial Load
   ↓
   Shell checks: userMfe.isLoggedIn()
   ↓
   ┌─────────────────────────────────────┐
   │ Not Logged In     │  Logged In      │
   ├─────────────────────────────────────┤
   │ → /login          │  → /feed        │
   │ → mountLogin()    │  → mountAvatar()│
   │                   │  → mountIcon()  │
   └─────────────────────────────────────┘

2. Login Success
   ↓
   User clicks "Sign In"
   ↓
   Login.jsx → mockApi.login()
   ↓
   Store in localStorage:
   - userToken
   - currentUser
   ↓
   Callback: onLogin(user)
   ↓
   Shell navigates to /feed

3. View Profile
   ↓
   User clicks avatar/icon
   ↓
   Shell navigates to /profile
   ↓
   ProfileHostComponent → mountProfile()
   ↓
   Profile.jsx loads user from props or localStorage

4. Logout
   ↓
   User clicks logout in Profile
   ↓
   Callback: onLogout()
   ↓
   userMfe.logout() clears localStorage
   ↓
   Shell navigates to /login
```

## Component Props & Callbacks

### Login Component
```typescript
Props: {
  onLogin: (user: User) => void;
  onRegisterClick: () => void;
}

User Object: {
  id: string;
  name: string;
  email: string;
  title: string;
  location: string;
  bio: string;
  photo: string;
  connections: number;
}
```

### Register Component
```typescript
Props: {
  onRegister: (user: User) => void;
  onLoginClick: () => void;
}
```

### Profile Component
```typescript
Props: {
  user?: User;          // Optional, will load from localStorage if not provided
  onLogout: () => void;
}
```

### UserAvatar Component
```typescript
Props: {
  user?: User;          // Optional, will load from localStorage if not provided
  onClick: () => void;
}
```

### UserIcon Component
```typescript
Props: {
  user?: User;          // Optional, will load from localStorage if not provided
  onClick: () => void;
}
```

## Color Scheme (LinkedIn-inspired)

```css
Primary Blue:     #0077B5
Hover Blue:       #006399
Background:       #f3f2ef
Text Primary:     #000000
Text Secondary:   #666666
Text Tertiary:    #888888
Border:          #dddddd
Error:           #cc3333
Success:         #057642
```

## Responsive Breakpoints

```css
Mobile:    max-width: 600px
Tablet:    max-width: 968px
Desktop:   min-width: 969px
```

## File Structure

```
src/
├── components/
│   ├── Login.jsx
│   ├── Login.css
│   ├── Register.jsx
│   ├── Register.css
│   ├── Profile.jsx
│   ├── Profile.css
│   ├── UserAvatar.jsx
│   ├── UserAvatar.css
│   ├── UserIcon.jsx
│   ├── UserIcon.css
│   └── UserCard.jsx (legacy, kept for compatibility)
│
├── api/
│   └── mockUserApi.js
│
├── App.js              (Main app, exports all components)
├── App.css
├── bootstrap.js        (Exposes runtime API)
├── index.js            (Entry point)
└── index.css
```

## Testing Credentials

```
User 1:
  Email: alice@example.com
  Password: pass
  
User 2:
  Email: bob@example.com
  Password: pass
```

## Next Steps

1. ✅ Components created
2. ✅ Runtime API exposed
3. ✅ Documentation complete
4. ⏳ Shell integration pending
5. ⏳ Real authentication API integration
6. ⏳ OAuth implementation
7. ⏳ Profile editing functionality
8. ⏳ Advanced features (connections, endorsements, etc.)
```
