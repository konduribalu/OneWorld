// ...existing code...
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { CommonModule } from '@angular/common';

// Declare webpack sharing symbols so TypeScript won't complain when we call them at runtime
declare const __webpack_init_sharing__: any;
declare const __webpack_share_scopes__: any;

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class ShellLayoutComponent {
  isLoginRoute = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isLoginRoute = window.location.pathname === '/login';
    });
    this.isLoginRoute = window.location.pathname === '/login';
  }
  sections = [
    { title: 'Feed', id: 'feed-mfe', icon: 'home', type: 'react', remoteEntry: 'http://localhost:4303/remoteEntry.js', element: 'feed-mfe' },
    { title: 'Search', id: 'search-mfe', icon: 'search', type: 'react', remoteEntry: 'http://localhost:4305/remoteEntry.js', element: 'search-mfe' },
    { title: 'Post', id: 'post-mfe', icon: 'edit', type: 'react', remoteEntry: 'http://localhost:4302/remoteEntry.js', element: 'post-mfe' },
    { title: 'Media', id: 'media-mfe', icon: 'image', type: 'react', remoteEntry: 'http://localhost:4306/remoteEntry.js', element: 'media-mfe' },
    { title: 'AI', id: 'ai-mfe', icon: 'robot', type: 'react', remoteEntry: 'http://localhost:4304/remoteEntry.js', element: 'ai-mfe' },
    { title: 'Analytics', id: 'analytics-mfe', icon: 'bar_chart', type: 'angular', remoteEntry: 'http://localhost:4201/remoteEntry.js', exposedModule: './Module' },
    { title: 'Comments', id: 'comment-mfe', icon: 'comment', type: 'angular', remoteEntry: 'http://localhost:4202/remoteEntry.js', exposedModule: './Module' },
    { title: 'Messaging', id: 'messaging-mfe', icon: 'chat', type: 'angular', remoteEntry: 'http://localhost:4203/remoteEntry.js', exposedModule: './Module' },
    { title: 'User', id: 'user-mfe', icon: 'person', type: 'react', remoteEntry: 'http://localhost:4301/remoteEntry.js', element: 'user-mfe' }
  ];
  // Start the shell showing the Post micro-frontend by default
  openSection: string = 'post-mfe';

  @ViewChild('mfeContainer', { static: false }) mfeContainer!: ElementRef;
  @ViewChild('userMfeHost', { static: false }) userMfeHost!: ElementRef;
  @ViewChild('userIconHost', { static: false }) userIconHost!: ElementRef;

  ngAfterViewInit() {
    this.loadSection(this.openSection);
    // Mount the user avatar/profile in the sidebar and header
    this.mountSidebarUserAvatar();
    this.mountHeaderUserIcon();
  }

  /** Mount the user avatar/profile in the sidebar using userMfe.mountAvatar if available, else fallback. */
  async mountSidebarUserAvatar() {
    const userSection = this.sections.find(s => s.id === 'user-mfe');
    if (!userSection || !this.userMfeHost || !this.userMfeHost.nativeElement) return;
    const container = this.userMfeHost.nativeElement as HTMLElement;
    // Show spinner while loading
    container.innerHTML = '<div class="sidebar-spinner">Loading...</div>';
    try {
      await this.addScript(userSection.remoteEntry);
      const bundleUrl = userSection.remoteEntry.replace(/remoteEntry\.js$/, 'bundle.js');
      await this.addScript(bundleUrl).catch(() => {});
      
      // Wait for runtime API
      const userApi = (window as any).userMfe;
      
      if (userApi && typeof userApi.mountAvatar === 'function') {
        // Get current user from the API
        const user = userApi.getCurrentUser();
        
        await userApi.mountAvatar(container, { 
          user,
          onClick: () => this.goToProfile()
        });
        return;
      }
      
      // Final fallback: static UI
      const user = { name: 'Guest User', title: 'Please log in', location: '' };
      container.innerHTML = `<div class="profile-avatar"><img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User Photo" /></div><div class="profile-info"><div class="profile-name">${user.name}</div><div class="profile-title">${user.title}</div></div>`;
    } catch (err) {
      container.innerHTML = '<div class="mfe-fallback">User info unavailable</div>';
      console.warn('[Shell] sidebar user-mfe failed:', err);
    }
  }

  /** Mount the user icon in the header */
  async mountHeaderUserIcon() {
    if (!this.userIconHost || !this.userIconHost.nativeElement) return;
    const container = this.userIconHost.nativeElement as HTMLElement;
    
    try {
      // Wait for userMfe API to be available
      const userApi = (window as any).userMfe;
      
      if (userApi && typeof userApi.mountIcon === 'function') {
        const user = userApi.getCurrentUser();
        
        await userApi.mountIcon(container, {
          user,
          onClick: () => this.goToProfile()
        });
      } else {
        // Fallback: simple static UI
        container.innerHTML = '<div style="cursor: pointer;" onclick="window.location.href=\'/profile\'"><span style="font-size: 24px;">👤</span></div>';
      }
    } catch (err) {
      console.warn('[Shell] header user-mfe failed:', err);
      container.innerHTML = '<div style="cursor: pointer;" onclick="window.location.href=\'/profile\'"><span style="font-size: 24px;">👤</span></div>';
    }
  }

  goToProfile() {
    // Navigate to profile route - the ProfileHostComponent will handle mounting
    this.router.navigate(['/profile']);
  }

  onSidebarProfileClick() {
    // Navigate to profile route - the ProfileHostComponent will handle mounting
    this.router.navigate(['/profile']);
  }

  /** Mount the full user profile into the main mfeContainer using the user-mfe runtime API when possible. */
  async mountUserProfile() {
    // clear existing content and show a loading placeholder
    try {
      if (!this.mfeContainer || !this.mfeContainer.nativeElement) return;
      this.clearMfe();
      const container = this.mfeContainer.nativeElement as HTMLElement;
      const loading = document.createElement('div');
      loading.className = 'mfe-loading';
      loading.textContent = 'Loading profile...';
      container.appendChild(loading);

      const userSection = this.sections.find(s => s.id === 'user-mfe');
      if (!userSection) {
        loading.textContent = 'Profile not available.';
        return;
      }

      // Ensure remoteEntry is loaded so registration or runtime API becomes available
      await this.addScript(userSection.remoteEntry).catch(() => {
        // continue; registration may still happen via other script
      });
      const bundleUrl = userSection.remoteEntry.replace(/remoteEntry\.js$/, 'bundle.js');
      await this.addScript(bundleUrl).catch(() => {});

      // Prefer runtime API if present
      const userApi = (window as any).userMfe;
      if (userApi && typeof userApi.mountProfile === 'function') {
        try {
          // unmount will be handled by clearMfe or userApi.unmount
          // remove loading indicator before mount
          container.innerHTML = '';
          await userApi.mountProfile(container, {});
          return;
        } catch (e) {
          console.warn('[Shell] userMfe.mountProfile failed', e);
        }
      }

      // Fallback: if custom element user-profile exists, create it
      if (customElements.get('user-profile')) {
        container.innerHTML = '';
        const el = document.createElement('user-profile');
        container.appendChild(el);
        return;
      }

      // If registration function exists, call it then wait for element
      const regFn = (window as any)['user-mfeRegister'];
      if (typeof regFn === 'function') {
        try { regFn(); } catch (e) { console.warn('[Shell] user-mfeRegister threw', e); }
        const ok = await this.waitForCustomElement('user-profile', 3000);
        if (ok) {
          container.innerHTML = '';
          container.appendChild(document.createElement('user-profile'));
          return;
        }
      }

      // Final fallback: show a friendly message
      container.innerHTML = '';
      const fallback = document.createElement('div');
      fallback.className = 'mfe-fallback';
      fallback.textContent = 'Profile is temporarily unavailable.';
      container.appendChild(fallback);
    } catch (err) {
      console.error('[Shell] mountUserProfile error', err);
    }
  }

  async toggleSection(id: string) {
    if (this.openSection === id) {
      return;
    }
    this.openSection = id;
    this.loadSection(id);
  }

  async loadSection(id: string) {
    this.clearMfe();
    const section = this.sections.find(s => s.id === id);
    if (!section) return;
    if (section.type === 'react') {
      await this.loadReactMfe(section);
    } else if (section.type === 'angular') {
      await this.loadAngularMfe(section);
    }
  }

  clearMfe() {
    if (this.mfeContainer && this.mfeContainer.nativeElement) {
      // If a React root was mounted, attempt to unmount it to avoid duplicate roots
      try {
        // react 18+ uses createRoot -> unmount via root.unmount(); remote roots may attach to window
        const existingRoot = (this.mfeContainer.nativeElement as any).__reactRoot;
        if (existingRoot && typeof existingRoot.unmount === 'function') {
          existingRoot.unmount();
        }
      } catch (e) {
        // ignore unmount errors
      }
      this.mfeContainer.nativeElement.innerHTML = '';
    }
  }

  /**
   * Load an exposed module from a remote using the Module Federation runtime API.
   * remoteEntryUrl: full url to remoteEntry.js
   * scope: the container name registered on window (e.g. 'postMfe')
   * module: exposed module path (e.g. './App')
   */
  async loadRemoteComponent(remoteEntryUrl: string, scope: string, module: string): Promise<any> {
    // Ensure remoteEntry script is loaded
    await this.addScript(remoteEntryUrl);

    // Init sharing
    if (typeof __webpack_init_sharing__ === 'function') {
      await __webpack_init_sharing__('default');
    } else {
      console.warn('[MFE Loader] __webpack_init_sharing__ is not available - shell may not be built with Module Federation');
    }

    const container = (window as any)[scope];
    if (!container) throw new Error(`Remote container ${scope} not found on window`);

    // Initialize the container with the shared scope
    if (container.init) {
      if (typeof __webpack_share_scopes__ !== 'undefined' && __webpack_share_scopes__.default) {
        try {
          await container.init(__webpack_share_scopes__.default);
          console.log(`[MFE Loader] Initialized container ${scope} with shared scope`);
        } catch (e) {
          console.warn(`[MFE Loader] Error initializing container ${scope}:`, e);
        }
      } else {
        console.warn('[MFE Loader] __webpack_share_scopes__ not available, skipping container init');
      }
    }

    // Get the module factory and execute it
    const factory = await container.get(module);
    const Module = factory();
    return Module;
  }

  /** Render a React component into the given container element.
   * Uses the shared React/ReactDOM from Module Federation.
   */
  async renderRemoteReact(RemoteComponent: any, containerEl: HTMLElement) {
    // Import React from shared modules (Module Federation will provide the singleton)
    const React = await import('react');
    const ReactDOM = await import('react-dom/client');

    // create root and attach for later unmount
    const root = (ReactDOM as any).createRoot(containerEl);
    // store root so clearMfe can unmount it
    (containerEl as any).__reactRoot = root;
    root.render((React as any).createElement(RemoteComponent));
  }

  async loadReactMfe(section: any) {
    // Enhanced error logging for remote loading
    try {
      await this.addScript(`${section.remoteEntry}`);
      console.log(`[MFE Loader] Loaded remoteEntry.js for ${section.id}`);
      const bundleUrl = section.remoteEntry.replace(/remoteEntry\.js$/, 'bundle.js');

      await this.addScript(bundleUrl).catch((e) => {
        console.warn(`[MFE Loader] Could not load bundle.js for ${section.id}:`, e);
      });

      // Wait a moment for async bootstrap to complete and set the registration function
      await new Promise(resolve => setTimeout(resolve, 500));

      // Always call the registration function after bundle.js loads
      const registerName = section.element + 'Register';
      const regFn = (window as any)[registerName];
      if (typeof regFn === 'function') {
        try {
          regFn();
          console.log(`[MFE Loader] Explicitly called registration function ${registerName} after bundle.js load.`);
        } catch (e) {
          console.error(`[MFE Loader] Error calling registration function ${registerName}:`, e);
        }
      } else {
        console.warn(`[MFE Loader] Registration function ${registerName} not found on window after bundle.js load.`);
      }

      // Wait for custom element registration
      if (customElements.get(section.element)) {
        console.log(`[MFE Loader] Custom element ${section.element} is registered.`);
        const el = document.createElement(section.element);
        this.mfeContainer.nativeElement.appendChild(el);
        return;
      }

      const registered = await this.waitForCustomElement(section.element, 5000);
      if (registered) {
        console.log(`[MFE Loader] Custom element ${section.element} registered after wait.`);
        const el = document.createElement(section.element);
        this.mfeContainer.nativeElement.appendChild(el);
        return;
      } else {
        console.error(`[MFE Loader] Custom element ${section.element} not registered after extended wait.`);
      }

      // fallback message
      const fallback = document.createElement('div');
      fallback.className = 'mfe-fallback';
      fallback.textContent = 'Unable to load the selected module right now.';
      this.mfeContainer.nativeElement.appendChild(fallback);
      console.error(`[MFE Loader] Fallback UI shown for ${section.id}.`);
    } catch (err) {
      const fallback = document.createElement('div');
      fallback.className = 'mfe-fallback error';
      fallback.textContent = 'Failed to load remote: ' + (err && (err as Error).message ? (err as Error).message : String(err));
      this.mfeContainer.nativeElement.appendChild(fallback);
      console.error(`[MFE Loader] Critical error loading remote for ${section.id}:`, err);
    }
  }

  /** Attempt to load and mount the standalone `user-mfe` microfrontend into the sidebar host. */
  async loadUserMfe() {
    const userSection = this.sections.find(s => s.id === 'user-mfe');
    if (!userSection || !this.userMfeHost || !this.userMfeHost.nativeElement) return;
    try {
      // Load remoteEntry and bundle as done for other MFEs
      await this.addScript(userSection.remoteEntry);
      const bundleUrl = userSection.remoteEntry.replace(/remoteEntry\.js$/, 'bundle.js');
      await this.addScript(bundleUrl).catch(() => {
        // bundle may be optional; continue
      });

      // Give the remote some time to register its custom element via its bootstrap
      await new Promise(resolve => setTimeout(resolve, 300));

      // If a registration function exists, call it
      const registerName = userSection.element + 'Register';
      const regFn = (window as any)[registerName];
      if (typeof regFn === 'function') {
        try { regFn(); } catch (e) { console.warn('[Shell] user-mfe register failed', e); }
      }

      // Wait briefly for the custom element and then mount it replacing fallback
      const elementName = userSection.element;
      if (!elementName) {
        console.warn('[Shell] userSection has no element name; cannot mount user-mfe');
        return;
      }
      const registered = await this.waitForCustomElement(elementName, 3000);
      if (registered) {
        const el = document.createElement(elementName);
        // clear fallback content
        this.userMfeHost.nativeElement.innerHTML = '';
        this.userMfeHost.nativeElement.appendChild(el);
        console.log('[Shell] user-mfe mounted in sidebar');
      } else {
        console.warn('[Shell] user-mfe not registered; leaving fallback UI');
      }
    } catch (err) {
      console.warn('[Shell] error loading user-mfe:', err);
    }
  }

  /**
   * Append a script to the document head and resolve when it's loaded.
   * If the script already exists, resolves immediately.
   */
  addScript(url: string, timeout = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!url) return reject(new Error('Empty script url'));

      // Remove any existing script tag for this URL (to force re-execution)
      const existing = document.querySelector(`script[src="${url}"]`);
      if (existing) {
        existing.parentNode?.removeChild(existing);
      }

      // Add cache-busting query string
      const cacheBustedUrl = url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now();

      const script = document.createElement('script');
      script.src = cacheBustedUrl;
      script.type = 'text/javascript';
      // Remove async for testing to force synchronous execution
      // script.async = true;
      script.crossOrigin = 'anonymous';

      let settled = false;
      const timer = window.setTimeout(() => {
        if (!settled) {
          settled = true;
          // resolve so host can attempt fallback; remote may not have bundle.js
          resolve();
        }
      }, timeout);

      script.onload = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve();
        }
      };
      script.onerror = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          // reject to allow caller to show an error fallback
          reject(new Error(`Failed to load script ${url}`));
        }
      };

      document.head.appendChild(script);
    });
  }

  /** Wait for a custom element tag to be defined up to a timeout (ms). */
  waitForCustomElement(tagName: string, timeout = 3000): Promise<boolean> {
    return new Promise((resolve) => {
      if (customElements.get(tagName)) return resolve(true);
      let settled = false;
      const observer = setInterval(() => {
        if (customElements.get(tagName)) {
          if (!settled) {
            settled = true;
            clearInterval(observer);
            resolve(true);
          }
        }
      }, 150);
      setTimeout(() => {
        if (!settled) {
          settled = true;
          clearInterval(observer);
          resolve(false);
        }
      }, timeout);
    });
  }

  async loadAngularMfe(section: any) {
    await loadRemoteModule({
      remoteEntry: section.remoteEntry,
      remoteName: section.id,
      exposedModule: section.exposedModule
    });
    // TODO: Use ViewContainerRef to inject the loaded Angular module/component
  }

  async loadRemoteScript(remoteEntry: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // load the remoteEntry first
      if (document.querySelector(`script[src="${remoteEntry}"]`)) {
        // if already loaded, also ensure bundle is loaded
        const bundleUrl = remoteEntry.replace(/remoteEntry\.js$/, 'bundle.js');
        if (!document.querySelector(`script[src="${bundleUrl}"]`)) {
          const bundleScript = document.createElement('script');
          bundleScript.src = bundleUrl;
          // allow cross-origin error details to be reported
          bundleScript.crossOrigin = 'anonymous';
          bundleScript.type = 'text/javascript';
          bundleScript.onload = () => resolve();
          bundleScript.onerror = () => resolve();
          document.body.appendChild(bundleScript);
        } else {
          resolve();
        }
        return;
      }

  const script = document.createElement('script');
  script.src = remoteEntry;
  // request with anonymous CORS so runtime exceptions from remote are not masked as "Script error"
  script.crossOrigin = 'anonymous';
  script.type = 'text/javascript';
      script.onload = () => {
        // After remoteEntry registers modules, also load the bundle so index.js runs and registers any globals
        const bundleUrl = remoteEntry.replace(/remoteEntry\.js$/, 'bundle.js');
        if (!document.querySelector(`script[src="${bundleUrl}"]`)) {
          const bundleScript = document.createElement('script');
          bundleScript.src = bundleUrl;
          // allow cross-origin error details to be reported
          bundleScript.crossOrigin = 'anonymous';
          bundleScript.type = 'text/javascript';
          bundleScript.onload = () => resolve();
          // even if bundle fails, resolve so shell can attempt fallback
          bundleScript.onerror = () => resolve();
          document.body.appendChild(bundleScript);
        } else {
          resolve();
        }
      };
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  }
}
