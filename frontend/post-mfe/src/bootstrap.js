
console.log('[post-mfe] bootstrap.js loaded. typeof window:', typeof window);
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// Import CSS as text to inject into shadow DOM
import indexCssText from './index.css?raw';
import appCssText from './App.css?raw';

// Register function to expose a custom element for the shell to mount
function registerPostMfe() {
  if (customElements.get('post-mfe')) return;

  class PostMfeElement extends HTMLElement {
    connectedCallback() {
      // create mount point inside shadow DOM to isolate styles
      this._mount = document.createElement('div');
      const shadowRoot = this.attachShadow({ mode: 'open' });
      
      // Inject CSS into shadow DOM
      const style = document.createElement('style');
      
      // Collect all stylesheet content from the document
      let allStyles = '';
      document.querySelectorAll('style').forEach(styleEl => {
        allStyles += styleEl.textContent + '\n';
      });
      
      // Also collect from link tags
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        // Note: This won't work for cross-origin stylesheets
        try {
          if (link.sheet && link.sheet.cssRules) {
            for (let rule of link.sheet.cssRules) {
              allStyles += rule.cssText + '\n';
            }
          }
        } catch (e) {
          console.warn('[post-mfe] Could not access stylesheet:', link.href);
        }
      });
      
      style.textContent = allStyles;
      shadowRoot.appendChild(style);
      shadowRoot.appendChild(this._mount);
      
      this._root = ReactDOM.createRoot(this._mount);
      this._root.render(
        React.createElement(React.StrictMode, null, React.createElement(App))
      );
    }

    disconnectedCallback() {
      try {
        if (this._root) this._root.unmount();
      } catch (e) {
        // ignore
      }
    }
  }

  customElements.define('post-mfe', PostMfeElement);
}

console.log('[post-mfe] About to set window["post-mfeRegister"]:', typeof window);
window['post-mfeRegister'] = registerPostMfe;
console.log('[post-mfe] window["post-mfeRegister"] set:', typeof window['post-mfeRegister']);

// Standalone behavior: if there is a #root element, mount app directly
const rootEl = document.getElementById('root');
if (rootEl) {
  // If running standalone, also register the custom element so both modes work
  registerPostMfe();
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    React.createElement(React.StrictMode, null, React.createElement(App))
  );
}

// Service worker and vitals (standalone)
serviceWorkerRegistration.unregister();
reportWebVitals();
