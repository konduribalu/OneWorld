import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #registerContainer class="register-host"></div>
  `,
  styles: [`
    .register-host {
      width: 100%;
      min-height: 100vh;
      background: #f3f2ef;
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
      if (!userMfe) {
        console.error('User MFE not available');
        return;
      }

      this.unmountFn = await userMfe.mountRegister(this.container.nativeElement, {
        onRegister: (user: any) => {
          console.log('User registered:', user);
          this.router.navigate(['/']);
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
