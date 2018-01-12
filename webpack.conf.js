import webpack from 'webpack';
import path from 'path';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import glob from 'glob';
import PurifyCSSPlugin from 'purifycss-webpack';

const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
  disable: process.env.NODE_ENV === 'development',
});

// process.traceDeprecation = true;

export default {
  module: {
    loaders: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=/[hash].[ext]',
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader',
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
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
    }),
    extractSass,
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'dist/**/*.html')),
      purifyOptions: {
        minify: true,
        rejected: true,
      },
    }),
    new UglifyJSPlugin(),
  ],

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
