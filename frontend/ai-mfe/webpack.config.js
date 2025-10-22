const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
module.exports = {
  optimization: { splitChunks: false },
  entry: { bundle: './src/index.js' },
  output: { path: path.resolve(__dirname, 'dist'), filename: '[name].js', publicPath: 'http://localhost:4304/' },
  resolve: { extensions: ['.js', '.jsx'] },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env', '@babel/preset-react'] } } },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  devServer: { static: path.join(__dirname, 'public'), port: 4304, allowedHosts: 'all', headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS', 'Access-Control-Allow-Headers': '*' } },
  plugins: [
    new ModuleFederationPlugin({
      name: 'aiMfe',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App' },
      shared: { react: { singleton: true, eager: false, requiredVersion: false }, 'react-dom': { singleton: true, eager: false, requiredVersion: false } }
    })
  ]
};
