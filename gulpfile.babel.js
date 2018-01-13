import gulp from 'gulp';
import { spawn } from 'child_process';
import log from 'fancy-log';
import PluginError from 'plugin-error';
import BrowserSync from 'browser-sync';
import webpack from 'webpack';
import svgstore from 'gulp-svgstore';
import svgmin from 'gulp-svgmin';
import inject from 'gulp-inject';
import webpackConfig from './webpack.conf';

const browserSync = BrowserSync.create();

const buildSite = options =>
  new Promise((resolve, reject) => {
    const defaultArgs = ['-d', '../dist', '-s', 'site'];
    if (process.env.DEBUG) defaultArgs.unshift('--debug');
    spawn(
      `./bin/hugo.${process.platform === 'win32' ? 'exe' : process.platform}`,
      options ? defaultArgs.concat(options) : defaultArgs,
      { stdio: 'inherit' },
    ).on('close', code => {
      if (code === 0) {
        browserSync.reload('notify:false');
        resolve();
      } else {
        browserSync.notify('Hugo build failed :(');
        reject(new Error('Hugo build failed'));
      }
    });
  });

gulp.task('hugo', () => buildSite());
gulp.task('hugo-preview', () => buildSite(['--buildDrafts', '--buildFuture']));
gulp.task('build', ['webpack', 'hugo']);
gulp.task('build-preview', ['webpack', 'hugo-preview']);

gulp.task(
  'webpack',
  () =>
    new Promise((resolve, reject) => {
      webpack(webpackConfig, (err, stats) => {
        if (err) reject(new PluginError('webpack', err));
        if (stats.hasErrors()) {
          reject(new PluginError({
            plugin: 'webpack',
            message: stats.toJson().errors,
          }));
        }
        log(
          '[webpack]',
          stats.toString({
            colors: true,
            progress: true,
          }),
        );
        browserSync.reload();
        resolve();
      });
    }),
);

gulp.task('svg', () =>
  gulp
    .src('site/layouts/partials/svg.html')
    .pipe(inject(
      gulp
        .src('site/static/image/icons-*.svg')
        .pipe(svgmin())
        .pipe(svgstore({ inlineSvg: true })),
      { transform: (filePath, { contents }) => contents.toString() },
    ))
    .pipe(gulp.dest('site/layouts/partials/')));

gulp.task('server', ['hugo', 'webpack', 'svg'], () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
  gulp.watch(['./src/**/*.js', './src/**/*.sccs'], ['webpack']);
  gulp.watch('./site/static/image/icons-*.svg', ['svg']);
  gulp.watch('./site/**/*', ['hugo', 'webpack']);
});
