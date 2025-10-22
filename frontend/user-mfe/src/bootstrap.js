console.log('[user-mfe] bootstrap.js loaded.');
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App, { Login, Register, Profile, UserAvatar, UserIcon } from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// Main custom element for full app
function registerUserMfe() {
  if (customElements.get('user-mfe')) return;
  class UserMfeElement extends HTMLElement {
    connectedCallback() { 
      this._mount = document.createElement('div'); 
      this.attachShadow({ mode: 'open' }).appendChild(this._mount); 
      this._root = ReactDOM.createRoot(this._mount); 
      this._root.render(
        React.createElement(React.StrictMode, null, React.createElement(App))
      ); 
    }
    disconnectedCallback() { 
      try { if (this._root) this._root.unmount(); } catch (e) {} 
    }
  }
  customElements.define('user-mfe', UserMfeElement);
}

window['user-mfeRegister'] = registerUserMfe;

console.log('[user-mfe] Initializing runtime API...');

// Expose a runtime API for the shell to mount individual components
// Force creation of new object to ensure clean state
window.userMfe = {
  /**
   * Mount Login component
   * @param {HTMLElement} container - DOM element to mount into
   * @param {Object} props - Component props { onLogin, onRegisterClick }
   * @returns {Function} Unmount function
   */
  mountLogin: async function(container, props = {}) {
    if (!container) throw new Error('No container provided to mountLogin');
    try {
      const mountRoot = document.createElement('div');
      container.innerHTML = '';
      container.appendChild(mountRoot);
      const root = ReactDOM.createRoot(mountRoot);
      mountRoot.__reactRoot = root;
      
      root.render(
        React.createElement(React.StrictMode, null, 
          React.createElement(Login, {
            onLogin: props.onLogin,
            onRegisterClick: props.onRegisterClick
          })
        )
      );
      
      return () => { try { root.unmount(); } catch (e) {} };
    } catch (e) {
      console.error('[user-mfe] mountLogin failed', e);
      throw e;
    }
  },

  /**
   * Mount Register component
   * @param {HTMLElement} container - DOM element to mount into
   * @param {Object} props - Component props { onRegister, onLoginClick }
   * @returns {Function} Unmount function
   */
  mountRegister: async function(container, props = {}) {
    if (!container) throw new Error('No container provided to mountRegister');
    try {
      const mountRoot = document.createElement('div');
      container.innerHTML = '';
      container.appendChild(mountRoot);
      const root = ReactDOM.createRoot(mountRoot);
      mountRoot.__reactRoot = root;
      
      root.render(
        React.createElement(React.StrictMode, null, 
          React.createElement(Register, {
            onRegister: props.onRegister,
            onLoginClick: props.onLoginClick
          })
        )
      );
      
      return () => { try { root.unmount(); } catch (e) {} };
    } catch (e) {
      console.error('[user-mfe] mountRegister failed', e);
      throw e;
    }
  },

  /**
   * Mount Profile component
   * @param {HTMLElement} container - DOM element to mount into
   * @param {Object} props - Component props { user, onLogout }
   * @returns {Function} Unmount function
   */
  mountProfile: async function(container, props = {}) {
    if (!container) throw new Error('No container provided to mountProfile');
    try {
      const mountRoot = document.createElement('div');
      container.innerHTML = '';
      container.appendChild(mountRoot);
      const root = ReactDOM.createRoot(mountRoot);
      mountRoot.__reactRoot = root;
      
      root.render(
        React.createElement(React.StrictMode, null, 
          React.createElement(Profile, {
            user: props.user,
            onLogout: props.onLogout
          })
        )
      );
      
      return () => { try { root.unmount(); } catch (e) {} };
    } catch (e) {
      console.error('[user-mfe] mountProfile failed', e);
      throw e;
    }
  },

  /**
   * Mount UserAvatar component (for sidebar)
   * @param {HTMLElement} container - DOM element to mount into
   * @param {Object} props - Component props { user, onClick }
   * @returns {Function} Unmount function
   */
  mountAvatar: async function(container, props = {}) {
    if (!container) throw new Error('No container provided to mountAvatar');
    try {
      const mountRoot = document.createElement('div');
      container.innerHTML = '';
      container.appendChild(mountRoot);
      const root = ReactDOM.createRoot(mountRoot);
      mountRoot.__reactRoot = root;
      
      root.render(
        React.createElement(React.StrictMode, null, 
          React.createElement(UserAvatar, {
            user: props.user,
            onClick: props.onClick
          })
        )
      );
      
      return () => { try { root.unmount(); } catch (e) {} };
    } catch (e) {
      console.error('[user-mfe] mountAvatar failed', e);
      throw e;
    }
  },

  /**
   * Mount UserIcon component (for top-right header)
   * @param {HTMLElement} container - DOM element to mount into
   * @param {Object} props - Component props { user, onClick }
   * @returns {Function} Unmount function
   */
  mountIcon: async function(container, props = {}) {
    if (!container) throw new Error('No container provided to mountIcon');
    try {
      const mountRoot = document.createElement('div');
      container.innerHTML = '';
      container.appendChild(mountRoot);
      const root = ReactDOM.createRoot(mountRoot);
      mountRoot.__reactRoot = root;
      
      root.render(
        React.createElement(React.StrictMode, null, 
          React.createElement(UserIcon, {
            user: props.user,
            onClick: props.onClick
          })
        )
      );
      
      return () => { try { root.unmount(); } catch (e) {} };
    } catch (e) {
      console.error('[user-mfe] mountIcon failed', e);
      throw e;
    }
  },

  /**
   * Check if user is logged in
   * @returns {boolean}
   */
  isLoggedIn: function() {
    return !!localStorage.getItem('userToken');
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null}
   */
  getCurrentUser: function() {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  /**
   * Logout current user
   */
  logout: function() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
  }
};

console.log('[user-mfe] Runtime API initialized with methods:', Object.keys(window.userMfe));
console.log('[user-mfe] mountLogin type:', typeof window.userMfe.mountLogin);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If the app is running standalone (development static), mount App into #root
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
}

