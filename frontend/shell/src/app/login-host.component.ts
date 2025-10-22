import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #loginContainer class="login-host"></div>
  `,
  styles: [`
    .login-host {
      width: 100%;
      min-height: 100vh;
      background: #f3f2ef;
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
      // Show loading message
      if (this.container?.nativeElement) {
        this.container.nativeElement.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #232526 0%, #414345 30%, #1976d2 60%, #64b5f6 100%);">
            <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); text-align: center;">
              <h2 style="margin-bottom: 20px; color: #1976d2;">Loading Login...</h2>
              <p style="color: #666;">Please wait while we load the authentication module.</p>
              <div style="margin-top: 20px;">
                <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #1976d2; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
              </div>
            </div>
          </div>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        `;
      }

      await this.loadUserMfe();
      
      const userMfe = (window as any).userMfe;
      if (!userMfe) {
        console.error('User MFE not available');
        this.showFallback('User MFE API not found. The user-mfe service may not be running on port 4301.');
        return;
      }

      if (typeof userMfe.mountLogin !== 'function') {
        console.error('User MFE API is incomplete. Missing mountLogin function.');
        console.log('Available userMfe properties:', Object.keys(userMfe));
        this.showFallback('User MFE API is incomplete. Please ensure user-mfe service is properly started on port 4301.');
        return;
      }

      // Mount the login component directly (don't check isLoggedIn to avoid errors)
      this.unmountFn = await userMfe.mountLogin(this.container.nativeElement, {
        onLogin: (user: any) => {
          console.log('User logged in:', user);
          this.router.navigate(['/']);
        },
        onRegisterClick: () => {
          this.router.navigate(['/register']);
        }
      });
    } catch (error) {
      console.error('Failed to mount login:', error);
      this.showFallback(`Failed to load login component: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  showFallback(message: string = 'The login component is temporarily unavailable. Please try again later.') {
    if (this.container?.nativeElement) {
      this.container.nativeElement.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); max-width: 500px;">
            <h2 style="color: #d32f2f; margin-bottom: 20px;">⚠️ Login Unavailable</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">${message}</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #333;">Troubleshooting Steps:</h3>
              <ol style="margin: 0; padding-left: 20px; color: #666; font-size: 14px; line-height: 1.8;">
                <li>Ensure user-mfe is running on port 4301</li>
                <li>Run: <code style="background: #e0e0e0; padding: 2px 6px; border-radius: 4px;">cd frontend/user-mfe && npm start</code></li>
                <li>Check browser console for errors</li>
                <li>Verify http://localhost:4301/remoteEntry.js is accessible</li>
              </ol>
            </div>
            <button onclick="window.location.reload()" style="background: #1976d2; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 600;">
              Retry
            </button>
            <button onclick="window.location.href='/'" style="background: #f5f5f5; color: #333; border: 1px solid #e0e0e0; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 600; margin-left: 10px;">
              Go to Feed
            </button>
          </div>
        </div>
      `;
    }
  }

  async loadUserMfe() {
    const remoteEntry = 'http://localhost:4301/remoteEntry.js';
    const bundleUrl = 'http://localhost:4301/bundle.js';
    
    await this.loadScript(remoteEntry);
    await this.loadScript(bundleUrl).catch(() => {});
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout: user-mfe did not load within 5 seconds. Please ensure the service is running on port 4301.'));
      }, 5000);

      const check = () => {
        if ((window as any).userMfe) {
          clearTimeout(timeout);
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
