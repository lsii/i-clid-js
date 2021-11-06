module.exports = {
  mode: 'production',
  entry: './src/main.ts',
  output: {
    filename: 'iclid.js',
    path: __dirname + '/dist'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts', '.js',
    ],
  },
  optimization:{
    minimize: true
  }
};
