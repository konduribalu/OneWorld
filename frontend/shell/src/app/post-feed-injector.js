// Post Feed Style Injector - Force new styles regardless of MFE loading
export function injectPostFeedStyles() {
    // Remove any existing style injection
    const existingStyle = document.getElementById('post-feed-force-styles');
    if (existingStyle) {
        existingStyle.remove();
    }

    // Create new style element
    const style = document.createElement('style');
    style.id = 'post-feed-force-styles';
    style.textContent = `
        /* 🔥 FORCE POST FEED STYLES 🔥 */
        
        /* Hide post feed titles */
        *[id*="mfe"] h1, *[id*="mfe"] h2, *[id*="mfe"] h3 {
            display: none !important;
        }
        
        /* Force gradient background */
        #mfe-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%) !important;
            min-height: 100vh !important;
            padding: 2rem 1rem !important;
        }
        
        /* Circular avatars */
        img[src*="avatar"], img[src*="user"], img[width="48"], img[width="40"],
        *[class*="avatar"], *[class*="composer-avatar"], *[class*="post-card-avatar"] {
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
            object-fit: cover !important;
            border: 2px solid transparent !important;
            background: linear-gradient(45deg, #667eea, #764ba2) !important;
            background-clip: padding-box !important;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
        }
        
        /* Professional cards */
        *[class*="post-composer"], *[class*="post-card"] {
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            border-radius: 16px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            margin-bottom: 2rem !important;
        }
        
        /* Glassmorphism effect */
        *[class*="App"] {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%) !important;
            min-height: 100vh !important;
        }
    `;
    
    // Inject into head
    document.head.appendChild(style);
    
    // Also try to inject into shadow DOM if it exists
    setTimeout(() => {
        const shadowRoots = document.querySelectorAll('*');
        shadowRoots.forEach(el => {
            if (el.shadowRoot) {
                const shadowStyle = style.cloneNode(true);
                el.shadowRoot.appendChild(shadowStyle);
            }
        });
    }, 1000);
    
    console.log('✅ Post feed styles injected!');
}

// Auto-inject on page load
document.addEventListener('DOMContentLoaded', injectPostFeedStyles);

// Also inject when new content is loaded (for SPAs)
const observer = new MutationObserver(() => {
    injectPostFeedStyles();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});