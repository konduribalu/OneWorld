# Shell Integration Guide - User MFE

## Overview

This guide explains how to integrate the updated user-mfe (LinkedIn-style components) with the Angular shell application.

## Key Changes

### ❌ Old Approach (Removed)
- Internal routing within user-mfe
- Basic login/register forms
- Simple profile view

### ✅ New Approach (Implemented)
- No internal routing - shell controls navigation
- LinkedIn-style components
- OAuth provider support
- Comprehensive profile view
- Modular component mounting

## Shell Updates Required

### 1. Update Routes (`app.routes.ts`)

```typescript
import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'feed', // Changed from 'login'
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginHostComponent // New component to host login
  },
  { 
    path: 'register', 
    component: RegisterHostComponent // New component to host register
  },
  { 
    path: 'profile', 
    component: ProfileHostComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'feed', 
    component: MainLayoutComponent, // Main app with sidebar
    canActivate: [AuthGuard]
  },
  { 
    path: '**', 
    redirectTo: 'feed' // Changed from 'login'
  }
];
```

### 2. Update Auth Guard (`auth.guard.ts`)

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Use user-mfe API to check login status
    const userMfe = (window as any).userMfe;
    const isLoggedIn = userMfe?.isLoggedIn() || false;
    
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
```

### 3. Create Login Host Component

Create `login-host.component.ts`:

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-host',
  standalone: true,
  template: '<div #loginContainer class="login-host"></div>',
  styles: [`
    .login-host {
      width: 100%;
      min-height: 100vh;
    }
  `]
})
export class LoginHostComponent implements AfterViewInit, OnDestroy {
  @ViewChild('loginContainer', { static: false }) container!: ElementRef;
  private unmountFn?: Function;

  constructor(private router: Router) {}

  async ngAfterViewInit() {
    await this.loadAndMountLogin();
  }

  async loadAndMountLogin() {
    try {
      // Ensure user-mfe is loaded
      await this.loadUserMfe();
      
      const userMfe = (window as any).userMfe;
      if (!userMfe) {
        console.error('User MFE not available');
        return;
      }

      // Mount login component
      this.unmountFn = await userMfe.mountLogin(this.container.nativeElement, {
        onLogin: (user: any) => {
          console.log('User logged in:', user);
          this.router.navigate(['/feed']);
        },
        onRegisterClick: () => {
          this.router.navigate(['/register']);
        }
      });
    } catch (error) {
      console.error('Failed to mount login:', error);
    }
  }

  async loadUserMfe() {
    const remoteEntry = 'http://localhost:4301/remoteEntry.js';
    const bundleUrl = 'http://localhost:4301/bundle.js';
    
    await this.loadScript(remoteEntry);
    await this.loadScript(bundleUrl).catch(() => {});
    
    // Wait for userMfe to be available
    return new Promise((resolve) => {
      const check = () => {
        if ((window as any).userMfe) {
          resolve(true);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  ngOnDestroy() {
    if (this.unmountFn) {
      this.unmountFn();
    }
  }
}
```

### 4. Create Register Host Component

Create `register-host.component.ts`:

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-host',
  standalone: true,
  template: '<div #registerContainer class="register-host"></div>',
  styles: [`
    .register-host {
      width: 100%;
      min-height: 100vh;
    }
  `]
})
export class RegisterHostComponent implements AfterViewInit, OnDestroy {
  @ViewChild('registerContainer', { static: false }) container!: ElementRef;
  private unmountFn?: Function;

  constructor(private router: Router) {}

  async ngAfterViewInit() {
    await this.loadAndMountRegister();
  }

  async loadAndMountRegister() {
    try {
      await this.loadUserMfe();
      
      const userMfe = (window as any).userMfe;
      if (!userMfe) return;

      this.unmountFn = await userMfe.mountRegister(this.container.nativeElement, {
        onRegister: (user: any) => {
          console.log('User registered:', user);
          this.router.navigate(['/feed']);
        },
        onLoginClick: () => {
          this.router.navigate(['/login']);
        }
      });
    } catch (error) {
      console.error('Failed to mount register:', error);
    }
  }

  async loadUserMfe() {
    const remoteEntry = 'http://localhost:4301/remoteEntry.js';
    const bundleUrl = 'http://localhost:4301/bundle.js';
    
    await this.loadScript(remoteEntry);
    await this.loadScript(bundleUrl).catch(() => {});
    
    return new Promise((resolve) => {
      const check = () => {
        if ((window as any).userMfe) {
          resolve(true);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  ngOnDestroy() {
    if (this.unmountFn) {
      this.unmountFn();
    }
  }
}
```

### 5. Update Accordion Component (Main Layout)

Update `accordion.component.ts` to mount UserAvatar and UserIcon:

```typescript
async mountSidebarUserAvatar() {
  const userSection = this.sections.find(s => s.id === 'user-mfe');
  if (!userSection || !this.userMfeHost || !this.userMfeHost.nativeElement) return;
  
  const container = this.userMfeHost.nativeElement as HTMLElement;
  container.innerHTML = '<div class="sidebar-spinner"></div>';
  
  try {
    await this.addScript(userSection.remoteEntry);
    const bundleUrl = userSection.remoteEntry.replace(/remoteEntry\.js$/, 'bundle.js');
    await this.addScript(bundleUrl).catch(() => {});
    
    const userApi = (window as any).userMfe;
    
    if (userApi && typeof userApi.mountAvatar === 'function') {
      const user = userApi.getCurrentUser();
      await userApi.mountAvatar(container, {
        user,
        onClick: () => this.goToProfile()
      });
      return;
    }
    
    // Fallback
    container.innerHTML = '<div class="mfe-fallback">User info temporarily unavailable.</div>';
  } catch (err) {
    container.innerHTML = '<div class="mfe-fallback">User info temporarily unavailable.</div>';
    console.warn('[Shell] sidebar user-mfe failed:', err);
  }
}

async mountHeaderUserIcon() {
  // Add a new ViewChild for header icon container
  if (!this.userIconHost || !this.userIconHost.nativeElement) return;
  
  const container = this.userIconHost.nativeElement as HTMLElement;
  
  try {
    const userApi = (window as any).userMfe;
    
    if (userApi && typeof userApi.mountIcon === 'function') {
      const user = userApi.getCurrentUser();
      await userApi.mountIcon(container, {
        user,
        onClick: () => this.goToProfile()
      });
    }
  } catch (err) {
    console.warn('[Shell] header user-mfe failed:', err);
  }
}

goToProfile() {
  this.router.navigate(['/profile']);
}
```

### 6. Update Template (`accordion.component.html`)

Replace the static user info in header:

```html
<div class="user-info">
  <div #userIconHost></div>
</div>
```

Update sidebar:

```html
<div class="profile-card">
  <div #userMfeHost class="user-mfe-host"></div>
</div>
```

### 7. Create Profile Host Component

Create `profile-host.component.ts`:

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-host',
  standalone: true,
  template: '<div #profileContainer class="profile-host"></div>',
  styles: [`
    .profile-host {
      width: 100%;
      min-height: 100vh;
    }
  `]
})
export class ProfileHostComponent implements AfterViewInit, OnDestroy {
  @ViewChild('profileContainer', { static: false }) container!: ElementRef;
  private unmountFn?: Function;

  constructor(private router: Router) {}

  async ngAfterViewInit() {
    await this.loadAndMountProfile();
  }

  async loadAndMountProfile() {
    try {
      await this.loadUserMfe();
      
      const userMfe = (window as any).userMfe;
      if (!userMfe) return;

      const user = userMfe.getCurrentUser();
      
      this.unmountFn = await userMfe.mountProfile(this.container.nativeElement, {
        user,
        onLogout: () => {
          userMfe.logout();
          this.router.navigate(['/login']);
        }
      });
    } catch (error) {
      console.error('Failed to mount profile:', error);
    }
  }

  async loadUserMfe() {
    const remoteEntry = 'http://localhost:4301/remoteEntry.js';
    const bundleUrl = 'http://localhost:4301/bundle.js';
    
    await this.loadScript(remoteEntry);
    await this.loadScript(bundleUrl).catch(() => {});
    
    return new Promise((resolve) => {
      const check = () => {
        if ((window as any).userMfe) {
          resolve(true);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  ngOnDestroy() {
    if (this.unmountFn) {
      this.unmountFn();
    }
  }
}
```

### 8. Update App Initialization

In `app.config.ts` or main initialization, add a guard to redirect to login if not authenticated:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    AuthGuard,
    // ... other providers
  ]
};
```

## Testing the Integration

1. **Start user-mfe**: `cd frontend/user-mfe && npm start`
2. **Start shell**: `cd frontend/shell && npm start`
3. **Test flow**:
   - Navigate to `http://localhost:4200`
   - Should redirect to `/login` if not authenticated
   - Login with `alice@example.com` / `pass`
   - Should redirect to `/feed`
   - Sidebar should show UserAvatar
   - Header should show UserIcon
   - Click avatar or icon to go to `/profile`
   - Profile page should show full LinkedIn-style profile
   - Click logout to return to login

## Benefits

- ✅ Clean separation of concerns
- ✅ Shell controls all navigation
- ✅ User state managed consistently
- ✅ Professional LinkedIn-style UI
- ✅ OAuth ready for future implementation
- ✅ Modular and reusable components
- ✅ Easy to test and maintain

## Notes

- All user state is stored in localStorage
- Auth token format: `mock-token-{userId}`
- User object format matches the structure in README.md
- Components are responsive and mobile-friendly
- Shell should handle loading states while mounting components
