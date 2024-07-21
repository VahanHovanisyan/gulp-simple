// rest of the code
const IS_BUILD = process.argv.includes('--production');
const IS_PHP = process.argv.includes('--php');
const domen = '';

// global plugins
import gulp from 'gulp';
import gulpNotify from 'gulp-notify';
import gulpPlumber from 'gulp-plumber';
import gulpChanged from 'gulp-changed';
import gulpIf from 'gulp-if';

// plugin for delete destFolder
import del from 'del';

// plugin for server
import browserSync from 'browser-sync';

// plugin for ftp
import ftp from 'vinyl-ftp';

// plugins for html
import gulpFileInclude from 'gulp-file-include';
import gulpTypograf from 'gulp-typograf';
import gulpWebpHtml from 'gulp-webp-html-nosvg';

// plugins for css
import gulpGroupCssMediaQueries from 'gulp-group-css-media-queries';
import gulpCsso from 'gulp-csso';
import gulpRename from 'gulp-rename';
import gulpAutoprefixer from 'gulp-autoprefixer';
// import gulpWebpCss from "gulp-webp-css";
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
const dartSass = gulpSass(sass);

// plugins for js
import webpackConfig from './webpack.config.js';
import webpackStream from 'webpack-stream';
import gulpBabel from 'gulp-babel';

// plugins for img
import imagemin from 'gulp-imagemin';
import gulpWebp from 'gulp-webp';

// plugins for svg
import gulpSvgSprite from 'gulp-svg-sprite';

// path
const srcFolder = './src/';
const destFolder = './docs/';

// config for plugins plumber and notify
const plumberNotify = addTitle => {
  return {
    errorHandler: gulpNotify.onError(error => ({
      title: addTitle,
      message: error.message,
    })),
  };
};

// ftp task
export const ftpConnect = () => {
  const conn = ftp.create({
    host: domen,
    user: 'username',
    password: 'userpassword',
    parallel: 10,
  });
  return gulp
    .src(`${destFolder}/**/*.*`)
    .pipe(gulpPlumber(plumberNotify('ftp')))
    .pipe(conn.dest(`/`));
};

// php task
export const php = () => {
  return gulp
    .src(`${srcFolder}php/**/*.php`)
    .pipe(gulpPlumber(plumberNotify('php')))
    .pipe(
      gulpFileInclude({
        prefix: '@',
        basepath: '@file',
      }),
    )
    .pipe(gulpIf(IS_BUILD, gulpWebpHtml()))
    .pipe(gulp.dest(destFolder));
};

// html task
export const html = () => {
  return gulp
    .src(`${srcFolder}html/*.html`)
    .pipe(gulpPlumber(plumberNotify('html')))
    .pipe(
      gulpFileInclude({
        prefix: '@',
        basepath: '@file',
      }),
    )
    .pipe(gulpIf(IS_BUILD, gulpWebpHtml()))
    .pipe(
      gulpTypograf({
        locale: ['ru', 'en-US'],
      }),
    )
    .pipe(gulp.dest(destFolder));
};

// css task
export const css = () => {
  return (
    gulp
      .src(`${srcFolder}scss/*.scss`, { sourcemaps: IS_BUILD ? false : true })
      .pipe(gulpPlumber(plumberNotify('css')))
      .pipe(dartSass())
      // .pipe(gulpWebpCss())
      .pipe(gulpGroupCssMediaQueries())

      .pipe(
        gulpIf(
          IS_BUILD,
          gulpAutoprefixer({
            cascade: false,
            overrideBrowserslist: ['last 5 versions'],
          }),
        ),
      )
      .pipe(gulpIf(IS_BUILD, gulpCsso()))
      .pipe(
        gulpRename({
          suffix: '.min',
          extname: '.css',
        }),
      )
      .pipe(
        gulp.dest(`${destFolder}css/`, { sourcemaps: IS_BUILD ? false : true }),
      )
  );
};

// js task
export const js = () => {
  return gulp
    .src(`${srcFolder}js/*.js`)
    .pipe(gulpPlumber(plumberNotify('js')))
    .pipe(gulpBabel())
    .pipe(
      webpackStream({
        mode: IS_BUILD ? 'production' : 'development',
        entry: webpackConfig,
        output: {
          filename: '[name].min.js',
        },
        module: {
          rules: [
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader'],
            },
          ],
        },
      }),
    )

    .pipe(gulp.dest(`${destFolder}js/`));
};

const imgExt = [
  'jpeg',
  'jpg',
  'png',
  'gif',
  'ico',
  'webp',
  'webmanifest',
  'xml',
  'json',
  'svg',
].join(',');

// img task
export const img = () => {
  return gulp
    .src(`${srcFolder}img/**/*.{${imgExt}}`)
    .pipe(gulpChanged(`${destFolder}img/`))
    .pipe(gulpPlumber(plumberNotify('img')))
    .pipe(gulpIf(IS_BUILD, gulpWebp()))
    .pipe(gulpIf(IS_BUILD, gulp.dest(`${destFolder}img/`)))
    .pipe(gulpIf(IS_BUILD, gulp.src(`${srcFolder}img/**/*.{${imgExt}}`)))
    .pipe(gulpIf(IS_BUILD, gulpChanged(`${destFolder}img/`)))
    .pipe(gulpIf(IS_BUILD, imagemin({ verbose: true })))
    .pipe(gulp.dest(`${destFolder}img/`));
};

// svg task
export const svg = () => {
  return gulp
    .src(`${srcFolder}svg/**/*.svg`)
    .pipe(gulpChanged(`${destFolder}img/svg/`))
    .pipe(gulpPlumber(plumberNotify('svg')))
    .pipe(
      gulpSvgSprite({
        mode: {
          symbol: {
            sprite: `../sprite.svg`,
          },
        },
      }),
    )
    .pipe(gulp.dest(`${destFolder}img/svg`));
};

// fonts task
export const fonts = () => {
  return gulp
    .src(`${srcFolder}fonts/**/*.{woff,woff2}`)
    .pipe(gulpChanged(`${destFolder}fonts/`))
    .pipe(gulp.dest(`${destFolder}fonts/`));
};

// files task
export const files = () => {
  return gulp
    .src(`${srcFolder}files/**/*.*`)
    .pipe(gulpChanged(`${destFolder}files/`))
    .pipe(gulp.dest(`${destFolder}files/`));
};

// delete docs dir
export const clean = () => {
  return del(destFolder);
};

// browser-sync server
export const server = () => {
  IS_PHP
    ? browserSync.init({
        proxy: domen,
      })
    : browserSync.init({
        server: {
          baseDir: destFolder,
        },
      });
};

// task to view changes to all tasks
export const watcher = () => {
  gulp.watch(`${srcFolder}files/**/*.*`).on('all', browserSync.reload);

  IS_PHP
    ? gulp.watch(`${srcFolder}php/**/*.php`, php).on('all', browserSync.reload)
    : gulp
        .watch(`${srcFolder}html/**/*.html`, html)
        .on('all', browserSync.reload);

  gulp.watch(`${srcFolder}scss/**/*.scss`, css).on('all', browserSync.reload);
  gulp.watch(`${srcFolder}js/**/*.js`, js).on('all', browserSync.reload);
  gulp
    .watch(`${srcFolder}img/**/*.{${imgExt}}`, img)
    .on('all', browserSync.reload);
  gulp.watch(`${srcFolder}svg/**/*.svg`, svg).on('all', browserSync.reload);
  gulp.watch(`${srcFolder}fonts/**/*.*`, fonts).on('all', browserSync.reload);
};

const mainTasks = gulp.parallel(
  IS_PHP ? php : html,
  css,
  js,
  img,
  svg,
  fonts,
  files,
);

// npm run tophp
// pnpm tophp
export const tophp = () => {
  return gulp
    .src(`${srcFolder}html/**/*.html`)
    .pipe(gulpPlumber(plumberNotify('toPhp')))
    .pipe(
      gulpRename({
        extname: '.php',
      }),
    )
    .pipe(gulp.dest(`${srcFolder}php/`));
};

// npm run dev or npm run devphp
// pnpm dev or pnpm devphp
export const dev = gulp.series(
  clean,
  mainTasks,
  gulp.parallel(server, watcher),
);

// npm run build or npm run buildphp
// pnpm build or pnpm buildphp
export const build = gulp.series(clean, mainTasks);

// npm run preview
// pnpm preview
export const previewBuild = gulp.series(
  clean,
  mainTasks,
  gulp.parallel(server),
);
