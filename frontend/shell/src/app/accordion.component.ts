import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class ShellLayoutComponent {
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
  openSection: string = 'feed-mfe';

  @ViewChild('mfeContainer', { static: false }) mfeContainer!: ElementRef;

  ngAfterViewInit() {
    this.loadSection(this.openSection);
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
      this.mfeContainer.nativeElement.innerHTML = '';
    }
  }

  async loadReactMfe(section: any) {
    await this.loadRemoteScript(section.remoteEntry);
    if (customElements.get(section.element)) {
      const el = document.createElement(section.element);
      this.mfeContainer.nativeElement.appendChild(el);
    } else {
      if ((window as any)[section.element + 'Register']) {
        (window as any)[section.element + 'Register']();
        const el = document.createElement(section.element);
        this.mfeContainer.nativeElement.appendChild(el);
      }
    }
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
      if (document.querySelector(`script[src="${remoteEntry}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = remoteEntry;
      script.type = 'text/javascript';
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  }
}
