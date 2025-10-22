// Async bootstrap so shared React can initialize first
console.log('[feed-mfe] index.js - importing bootstrap');
import('./bootstrap').catch(err => console.error('[feed-mfe] bootstrap load failed', err));
