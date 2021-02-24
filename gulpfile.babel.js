// import packages
import gulp from "gulp";
import yargs from "yargs";
import sass from "gulp-sass";
import prefix from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css"; // minify css
import gulpif from "gulp-if";
import sourcemaps from "gulp-sourcemaps";
import imagemin from "gulp-imagemin";
import del from "del";
import webpack from "webpack-stream";
import uglify from "gulp-uglify";
import named from "vinyl-named";
import browserSync from "browser-sync";
const server = browserSync.create();
import zip from 'gulp-zip';
import replace from 'gulp-replace';
import info from './package';

// for yargs
const PRODUCTION = yargs.argv.prod;

// src & destination paths
const paths = {
  // path & dest for stylesheet
  styles: {
    src: ['src/assets/scss/style.scss', 'src/assets/scss/admin.scss'],
    dest: 'dist/assets/css'
  },
  // path & dest for images
  images: {
    src: 'src/assets/images/**/*.{jpg,jpeg,png,gif,svg}',
    dest: 'dist/assets/images'
  },
  // path for js
  js: {
    src: ['src/assets/js/main.js', 'src/assets/js/admin.js'],
    dest: 'dist/assets/js'
  },
  // path & dest for copy file
   other: {
     src: ['src/assets/**/*', '!src/assets/{images, js, scss}', '!src/assets/{images, js, scss}/**/*'],
     dest: 'dist/assets'
   },
  package: {
    src: ['**/*', '!node_modules{,/**}', '!src{,/**}', '!gitignore', '!.babelrc', '!gulpfile.babel.js', '!package-lock.json', '!package.json'], // // customise it
    dest: 'packeged' // customise it
  }
}

// create task here
// style task
export const styles = () => {
  return gulp.src(paths.styles.src)
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(prefix({
      "browsers": ['last 2 versions'],
      "casecade": false
    }))
    .pipe(gulpif(PRODUCTION, cleanCSS({compatibility: 'ie8'})))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream()); // for browser reload after css change
}

// image task
export const images = () => {
  return gulp.src(paths.images.src)
    .pipe(gulpif(!PRODUCTION, imagemin()))
    .pipe(gulp.dest(paths.images.dest))
}

// copy task
export const copy = () => {
  return gulp.src(paths.other.src)
    .pipe(gulp.dest(paths.other.dest))
}

// delete task from dist folder
export const clean = () => {
  return del(['dist']);
}

// js task
export const js = () => {
  return gulp.src(paths.js.src)
    .pipe(named())
    .pipe(webpack({
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      },
      output: {
        filename: '[name].js'
      },
      // devtool: 'inline-source-map'
      devtool: !PRODUCTION ? 'inline-source-map' : false
    }))
    .pipe(gulpif(PRODUCTION, uglify()))
    .pipe(gulp.dest(paths.js.dest))
}

// gulp watches file changes automatically
export const watch = () => {
  gulp.watch('src/assets/scss/**/*.scss', styles);
  gulp.watch('src/assets/js/**/*.js', gulp.series(js, reload));
  gulp.watch('**/*.php', reload); // for php
  gulp.watch(paths.images.src, gulp.series(images, reload));
  gulp.watch(paths.other.src, gulp.series(copy, reload));
}

// browser serve & reload
export const serve = (done) => {
  server.init({
    proxy: 'http://localhost/projects/zeropoint/' // customize it
  });
  done();
}
export const reload = (done) => {
  server.reload();
  done();
}

// project final production as zip
export const compress = () => {
  return gulp.src(paths.package.src)
    .pipe(replace('_themename', info.name)) 
    .pipe(zip(`${info.name}.zip`)) 
    .pipe(gulp.dest(paths.package.dest))
}

// task serialize
export const dev = gulp.series(clean, gulp.parallel(styles, js, images, copy), serve, watch); // for development
export const build = gulp.series(clean, gulp.parallel(styles, js, images, copy)); // for production
export const bundle = gulp.series(build, compress); // for creating final project

// default task
export default dev;