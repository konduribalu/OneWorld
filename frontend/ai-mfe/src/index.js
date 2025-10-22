console.log('[ai-mfe] index.js - importing bootstrap');
import('./bootstrap').catch(err => console.error('[ai-mfe] bootstrap load failed', err));
