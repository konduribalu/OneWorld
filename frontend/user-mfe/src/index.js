// Async bootstrap so shared React can initialize first
console.log('[user-mfe] index.js - importing bootstrap');
import('./bootstrap').catch(err => console.error('[user-mfe] bootstrap load failed', err));
