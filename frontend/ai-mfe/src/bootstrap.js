console.log('[ai-mfe] bootstrap.js loaded.');
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

function registerAiMfe() {
  if (customElements.get('ai-mfe')) return;
  class AiMfeElement extends HTMLElement {
    connectedCallback() {
      this._mount = document.createElement('div');
      this.attachShadow({ mode: 'open' }).appendChild(this._mount);
      this._root = ReactDOM.createRoot(this._mount);
      this._root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
    }
    disconnectedCallback() { try { if (this._root) this._root.unmount(); } catch (e) { } }
  }
  customElements.define('ai-mfe', AiMfeElement);
}

window['ai-mfeRegister'] = registerAiMfe;

const rootEl = document.getElementById('root');
if (rootEl) { registerAiMfe(); const root = ReactDOM.createRoot(rootEl); root.render(React.createElement(React.StrictMode, null, React.createElement(App))); }

serviceWorkerRegistration.unregister();
reportWebVitals();
