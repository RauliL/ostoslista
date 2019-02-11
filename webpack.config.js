const nodeExternals = require('webpack-node-externals');
const path = require('path');

const backendConfig = {
  target: 'node',
  entry: [
    path.join(__dirname, 'backend', 'index.ts')
  ],
  output: {
    path: __dirname,
    filename: 'server.js'
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.js']
  },
  node: {
    __dirname: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: path.join(__dirname, 'tsconfig.backend.json')
        }
      }
    ]
  }
};

const frontendConfig = {
  entry: [
    path.join(__dirname, 'frontend', 'index.ts')
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: path.join(__dirname, 'tsconfig.frontend.json')
        }
      }
    ]
  }
};

module.exports = [backendConfig, frontendConfig];
