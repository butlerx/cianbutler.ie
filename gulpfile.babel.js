import gulp from 'gulp';
import { spawn } from 'child_process';
import gutil from 'gulp-util';
import BrowserSync from 'browser-sync';
import webpack from 'webpack';
import svgstore from 'gulp-svgstore';
import svgmin from 'gulp-svgmin';
import inject from 'gulp-inject';
import webpackConfig from './webpack.conf';

const browserSync = BrowserSync.create();
const hugoBin = `./bin/hugo.${process.platform === 'win32' ? 'exe' : process.platform}`;
const defaultArgs = ['-d', '../dist', '-s', 'site'];

if (process.env.DEBUG) defaultArgs.unshift('--debug');

const buildSite = (cb, options) =>
  spawn(hugoBin, options ? defaultArgs.concat(options) : defaultArgs, { stdio: 'inherit' }).on(
    'close',
    code => {
      if (code === 0) {
        browserSync.reload('notify:false');
        cb();
      } else {
        browserSync.notify('Hugo build failed :(');
        cb('Hugo build failed');
      }
    },
  );

gulp.task('hugo', cb => buildSite(cb));
gulp.task('hugo-preview', cb => buildSite(cb, ['--buildDrafts', '--buildFuture']));
gulp.task('build', ['webpack', 'hugo']);
gulp.task('build-preview', ['webpack', 'hugo-preview']);

gulp.task('webpack', cb => {
  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) throw new gutil.PluginError('webpack', err);
    gutil.log(
      '[webpack]',
      stats.toString({
        colors: true,
        progress: true,
      }),
    );
    browserSync.reload();
    cb();
  });
});

gulp.task('svg', () =>
  gulp
    .src('site/layouts/partials/svg.html')
    .pipe(
      inject(
        gulp
          .src('site/static/image/icons-*.svg')
          .pipe(svgmin())
          .pipe(svgstore({ inlineSvg: true })),
        { transform: (filePath, { contents }) => contents.toString() },
      ),
    )
    .pipe(gulp.dest('site/layouts/partials/')),
);

gulp.task('server', ['hugo', 'webpack', 'svg'], () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
  gulp.watch('./src/**/*.(js|sccs)', ['webpack']);
  gulp.watch('./site/static/image/icons-*.svg', ['svg']);
  gulp.watch('./site/**/*', ['hugo']);
});
