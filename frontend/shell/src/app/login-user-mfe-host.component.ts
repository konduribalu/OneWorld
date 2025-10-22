import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-mfe-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-gradient-bg">
      <div class="login-center">
        <div #hostElement class="user-mfe-main-host">
          <div class="login-card">
            <div class="login-logo">OneWorld</div>
            <h2>Sign in to your account</h2>
            <form (submit)="onLogin($event)">
              <div class="login-field">
                <label>Username</label>
                <input type="text" name="username" required autocomplete="username" />
              </div>
              <div class="login-field">
                <label>Password</label>
                <input type="password" name="password" required autocomplete="current-password" />
              </div>
              <button class="login-btn" type="submit">Login</button>
            </form>
            <div class="oauth-divider"><span>or sign in with</span></div>
            <div class="oauth-buttons">
              <button class="oauth-btn google" type="button" disabled>Google</button>
              <button class="oauth-btn microsoft" type="button" disabled>Microsoft</button>
              <button class="oauth-btn github" type="button" disabled>GitHub</button>
            </div>
            <p *ngIf="loginError" class="login-error">{{loginError}}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserMfeHostComponent implements AfterViewInit {
  @ViewChild('hostElement', { static: true }) hostElement!: ElementRef;
  loginError: string = '';

  async ngAfterViewInit() {
    // Try to mount user-mfe if it has been registered as a custom element.
    try {
      const tag = 'user-mfe';
      if (customElements.get(tag)) {
        const el = document.createElement(tag);
        this.hostElement.nativeElement.innerHTML = '';
        this.hostElement.nativeElement.appendChild(el);
        return;
      }

      // Otherwise attempt to call registration function if present
      const regFn = (window as any)[tag + 'Register'];
      if (typeof regFn === 'function') {
        try { regFn(); } catch (e) { /* ignore */ }
      }

      // Wait a short time for registration
      const registered = await new Promise<boolean>(resolve => {
        if (customElements.get(tag)) return resolve(true);
        let settled = false;
        const t = setInterval(() => {
          if (customElements.get(tag)) {
            if (!settled) { settled = true; clearInterval(t); resolve(true); }
          }
        }, 150);
        setTimeout(() => { if (!settled) { settled = true; clearInterval(t); resolve(false); } }, 2500);
      });

      if (registered) {
        const el = document.createElement(tag);
        this.hostElement.nativeElement.innerHTML = '';
        this.hostElement.nativeElement.appendChild(el);
      }
    } catch (e) {
      // swallow errors - fallback UI remains
      console.warn('[UserMfeHost] mount failed', e);
    }
  }

  onLogin(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    // Simple demo: accept any non-empty username/password
    if (username && password) {
      localStorage.setItem('userToken', 'demo-token');
      this.loginError = '';
      window.location.href = '/profile';
    } else {
      this.loginError = 'Invalid username or password.';
    }
  }
}
