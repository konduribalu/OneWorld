console.log('[media-mfe] index.js - importing bootstrap');
import('./bootstrap').catch(err => console.error('[media-mfe] bootstrap load failed', err));
