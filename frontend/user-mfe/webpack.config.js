const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const constPort = process.env.PORT ? Number(process.env.PORT) : 4301;
module.exports = {
  optimization: { splitChunks: false },
  entry: { bundle: './src/index.js' },
  output: { path: path.resolve(__dirname, 'dist'), filename: '[name].js', publicPath: `http://localhost:${constPort}/` },
  resolve: { extensions: ['.js', '.jsx'] },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
        }
      },
  { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      // Support importing SVGs as React components via @svgr/webpack and other images as resources
      { test: /\.svg$/i, issuer: /\.[jt]sx?$/, use: ['@svgr/webpack'] },
      { test: /\.(png|jpe?g|gif|bmp|ico)$/i, type: 'asset/resource' }
    ]
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    port: process.env.PORT ? Number(process.env.PORT) : 4301,
    allowedHosts: 'all',
    historyApiFallback: true,
    proxy: {
      '/posts': 'http://localhost:4002',
      '/upload': 'http://localhost:4001'
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    }
  },
  plugins: [ new ModuleFederationPlugin({ name: 'userMfe', filename: 'remoteEntry.js', exposes: { './App': './src/App' }, shared: { react: { singleton: true, eager: false, requiredVersion: false }, 'react-dom': { singleton: true, eager: false, requiredVersion: false } } }) ]
};
