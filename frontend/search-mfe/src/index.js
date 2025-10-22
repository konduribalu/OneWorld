console.log('[search-mfe] index.js - importing bootstrap');
import('./bootstrap').catch(err => console.error('[search-mfe] bootstrap load failed', err));
