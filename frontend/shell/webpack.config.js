const { withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  remotes: {
    'userMfe': 'userMfe@http://localhost:4301/remoteEntry.js',
    'postMfe': 'postMfe@http://localhost:4302/remoteEntry.js',
    'feedMfe': 'feedMfe@http://localhost:3003/remoteEntry.js',
    'aiMfe': 'aiMfe@http://localhost:3004/remoteEntry.js',
    'searchMfe': 'searchMfe@http://localhost:3005/remoteEntry.js',
    'mediaMfe': 'mediaMfe@http://localhost:3006/remoteEntry.js',
    'analyticsMfe': 'analyticsMfe@http://localhost:4201/remoteEntry.js',
    'commentMfe': 'commentMfe@http://localhost:4202/remoteEntry.js',
    'messagingMfe': 'messagingMfe@http://localhost:4203/remoteEntry.js'
  },
  shared: {
    '@angular/core': { singleton: true, strictVersion: true },
    '@angular/common': { singleton: true, strictVersion: true },
    '@angular/router': { singleton: true, strictVersion: true },
    'react': { singleton: true, eager: false, requiredVersion: false },
    'react-dom': { singleton: true, eager: false, requiredVersion: false }
  }
});
