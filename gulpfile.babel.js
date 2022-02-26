import gulp from 'gulp';
import gpug from 'gulp-pug';
import del from 'del';
import ws from 'gulp-webserver';
import image from 'gulp-image';
import gSass from 'gulp-sass';
import nSass from 'node-sass';
const sass = gSass(nSass);
import autop from 'gulp-autoprefixer';
import bro from 'gulp-bro';
import babelify from 'babelify';

const routes = {
  pug: {
    src: 'src/*.pug',
    dest: 'build/',
  },
  img: {
    src: 'src/img/*',
    dest: 'build/img',
  },
  scss: {
    src: 'src/scss/style.scss',
    dest: 'build/css',
  },
  js: {
    src: 'src/js/main.js',
    dest: 'build/js',
  },
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del(['build/']);

const webserver = () =>
  gulp.src('build/').pipe(ws({ livereload: true, open: true }));

const img = () =>
  gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autop())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ['@babel/preset-env'] }),
          ['uglifyify', { global: true }],
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest));

const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug, styles, js]);
const live = gulp.parallel([webserver]);

export const dev = gulp.series([prepare, assets, live]);
