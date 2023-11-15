import gulp from "gulp";
import del from "del";
import gulpFileInclude from "gulp-file-include";
import gulpTypograf from "gulp-typograf";
import gulpNotify from "gulp-notify";
import gulpPlumber from "gulp-plumber";
import webpackStream from "webpack-stream";
import gulpSvgSprite from "gulp-svg-sprite";
import browserSync from "browser-sync";
import gulpSass from "gulp-sass";
import * as sass from 'sass';
const dartSass = gulpSass(sass);
const srcFolder = './src/';
const destFolder = './public/';

const plumberNotify = (addTitle) => {
  return {
    errorHandler: gulpNotify.onError(error => ({
      title: addTitle,
      message: error.message
    }))
  }
}

const html = () => {
  return gulp.src(`${srcFolder}*.html`)
    .pipe(gulpPlumber(plumberNotify('html')))
    .pipe(gulpFileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(gulpTypograf({
      locale: ['ru', 'en-US']
    }))
    .pipe(gulp.dest(destFolder))
}
export { html }

const css = () => {
  return gulp.src(`${srcFolder}scss/*.scss`, { sourcemaps: true })
    .pipe(gulpPlumber(plumberNotify('css')))
    .pipe(dartSass())
    .pipe(gulp.dest(`${destFolder}css/`, { sourcemaps: true }))
}
export { css }

const js = () => {
  return gulp.src(`${srcFolder}js/*.js`)
    .pipe(gulpPlumber(plumberNotify('js')))
    .pipe(webpackStream({
      mode: 'development',
      entry: {
        index: './src/js/index.js'
        // contacts: './src/js/contacts.js',
        // about: './src/js/about.js',
      },
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
    }))
    .pipe(gulp.dest(`${destFolder}js/`))
}
export { js }

const img = () => {
  return gulp.src(`${srcFolder}img/**/*.{jpeg,jpg,png,gif,ico,webp,webmanifest,xml,json}`)
    .pipe(gulpPlumber(plumberNotify('img')))

    .pipe(gulp.dest(`${destFolder}img/`))
}
export { img }

const svg = () => {
  return gulp.src(`${srcFolder}svg/**/*.svg`)
    .pipe(gulpPlumber(plumberNotify('svg')))
    .pipe(gulpSvgSprite({
      mode: {
        stack: {
          sprite: `../sprite.svg`,
        },
      }
    }))
    .pipe(gulp.dest(`${destFolder}img/svg`))
}
export { svg }

const fonts = () => {
  return gulp.src(`${srcFolder}fonts/**/*.{woff,woff2}`)
    .pipe(gulp.dest(`${destFolder}fonts/`))
}
export { fonts }

const files = () => {
  return gulp.src(`${srcFolder}files/**/*.*`)
    .pipe(gulp.dest(`${destFolder}files/`))
}
export { files }

const server = () => {
  browserSync.init({
    server: {
      baseDir: destFolder
    }
  })
}
export { server }

const clean = () => {
  return del(destFolder)
}
export { clean }

const watcher = () => {
  gulp.watch(`${srcFolder}files/**/*.*`).on("all", browserSync.reload)
  gulp.watch(`${srcFolder}**/*.html`, html).on("all", browserSync.reload)
  gulp.watch(`${srcFolder}**/*.scss`, css).on("all", browserSync.reload)
  gulp.watch(`${srcFolder}**/*.js`, js).on("all", browserSync.reload)
  gulp.watch(`${srcFolder}img/**/*.{jpeg,jpg,png,gif,ico,webp,webmanifest,xml,json}`, img).on("all", browserSync.reload)
  gulp.watch(`${srcFolder}svg/**/*.svg`, svg).on("all", browserSync.reload)
  gulp.watch(`${srcFolder}fonts/**/*.*`, fonts).on("all", browserSync.reload)
}

export {watcher}

const mainTasks = gulp.parallel(html, css, js, img, svg, fonts, files)
export { mainTasks }

const dev = gulp.series(clean, mainTasks, gulp.parallel(server, watcher))
export { dev }
