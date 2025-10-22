console.log('[media-mfe] bootstrap.js loaded.');
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

function registerMediaMfe() {
  if (customElements.get('media-mfe')) return;
  class MediaMfeElement extends HTMLElement {
    connectedCallback() { this._mount = document.createElement('div'); this.attachShadow({ mode: 'open' }).appendChild(this._mount); this._root = ReactDOM.createRoot(this._mount); this._root.render(React.createElement(React.StrictMode, null, React.createElement(App))); }
    disconnectedCallback() { try { if (this._root) this._root.unmount(); } catch (e) {} }
  }
  customElements.define('media-mfe', MediaMfeElement);
}

window['media-mfeRegister'] = registerMediaMfe;
const _rootEl = document.getElementById('root');
if (_rootEl) {
  registerMediaMfe();
  const root = ReactDOM.createRoot(_rootEl);
  root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
}
serviceWorkerRegistration.unregister();
reportWebVitals();
console.log('[media-mfe] bootstrap.js loaded.');
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

function registerMediaMfe() {
  if (customElements.get('media-mfe')) return;
  class MediaMfeElement extends HTMLElement {
    connectedCallback() { this._mount = document.createElement('div'); this.attachShadow({ mode: 'open' }).appendChild(this._mount); this._root = ReactDOM.createRoot(this._mount); this._root.render(React.createElement(React.StrictMode, null, React.createElement(App))); }
    disconnectedCallback() { try { if (this._root) this._root.unmount(); } catch (e) {} }
  }
  customElements.define('media-mfe', MediaMfeElement);
}

window['media-mfeRegister'] = registerMediaMfe;
const rootEl = document.getElementById('root'); if (rootEl) { registerMediaMfe(); const root = ReactDOM.createRoot(rootEl); root.render(React.createElement(React.StrictMode, null, React.createElement(App))); }
serviceWorkerRegistration.unregister(); reportWebVitals();
