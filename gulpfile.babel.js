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
    const hugo = spawn(
      `./bin/hugo.${process.platform === 'win32' ? 'exe' : process.platform}`,
      options ? defaultArgs.concat(options) : defaultArgs,
    ).on('close', code => {
      if (code === 0) {
        browserSync.reload('notify:false');
        resolve();
      } else {
        browserSync.notify('Hugo build failed :(');
        reject(new PluginError({ plugin: 'hugo', message: ' build failed' }));
      }
    });
    hugo.stdout.on('data', data => log('[hugo]', data.toString()));
    hugo.stderr.on('data', data => log('[hugo]', data.toString()));
  });

function buildAssets(err, stats) {
  if (err || stats.hasErrors()) {
    return Promise.reject(new PluginError({
      plugin: 'webpack',
      message: err || stats.toJson().errors,
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
  return Promise.resolve();
}

gulp.task('hugo', () => buildSite());
gulp.task('hugo-preview', () => buildSite(['--buildDrafts', '--buildFuture']));
gulp.task('build', ['webpack', 'hugo']);
gulp.task('build-preview', ['webpack', 'hugo-preview']);

gulp.task('webpack', () => webpack(webpackConfig, buildAssets));

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

gulp.task('server', ['hugo', 'svg'], () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
  const compiler = webpack(webpackConfig);
  compiler.watch({
    aggregateTimeout: 360,
    poll: true,
  }, buildAssets);
  gulp.watch('./site/static/image/icons-*.svg', ['svg']);
  gulp.watch('./site/**/*', ['hugo']);
});
