import webpack from 'webpack';
import path from 'path';
import glob from 'glob';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import PurifyCSSPlugin from 'purifycss-webpack';

const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
  disable: process.env.NODE_ENV === 'development',
});

const plugins = [
  new webpack.ProvidePlugin({
    fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
  }),
  extractSass,
];

if (process.env.NODE_ENV !== 'development') {
  plugins.concat([
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'dist/**/*.html')),
      minify: true,
    }),
    new UglifyJSPlugin({
      cache: true,
      parallel: true,
      uglifyOptions: {
        ecma: 8,
      },
    }),
  ]);
}

export default {
  module: {
    loaders: [
      {
        test: /\.((png)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=/[hash].[ext]',
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader',
              options: { minimize: true },
            },
            {
              loader: 'sass-loader',
            },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        loader: 'babel-loader',
        test: /\.js?$/,
        exclude: /node_modules/,
        query: { cacheDirectory: true },
      },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?mimetype=image/svg+xml' },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?mimetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?mimetype=application/octet-stream',
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
    ],
  },

  plugins,
  context: path.join(__dirname, 'src'),
  entry: {
    main: ['./js/main'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  externals: [/^vendor\/.+\.js$/],
};
