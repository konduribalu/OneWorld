console.log('[feed-mfe] bootstrap.js loaded.');
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

function registerFeedMfe() {
  if (customElements.get('feed-mfe')) return;
  class FeedMfeElement extends HTMLElement {
    connectedCallback() {
      this._mount = document.createElement('div');
      this.attachShadow({ mode: 'open' }).appendChild(this._mount);
      this._root = ReactDOM.createRoot(this._mount);
      this._root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
    }
    disconnectedCallback() {
      try { if (this._root) this._root.unmount(); } catch (e) { }
    }
  }
  customElements.define('feed-mfe', FeedMfeElement);
}

window['feed-mfeRegister'] = registerFeedMfe;

const rootEl = document.getElementById('root');
if (rootEl) {
  registerFeedMfe();
  const root = ReactDOM.createRoot(rootEl);
  root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
}

serviceWorkerRegistration.unregister();
reportWebVitals();
