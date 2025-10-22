// Async import to allow shared modules (React/ReactDOM) to be loaded first
console.log('[post-mfe] index.js loaded - importing bootstrap asynchronously');
import('./bootstrap').catch(err => {
  console.error('[post-mfe] Failed to load bootstrap:', err);
});
