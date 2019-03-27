var gulp = require("gulp"),
  autoprefixer = require("gulp-autoprefixer"),
  browserSync = require("browser-sync").create(),
  reload = browserSync.reload,
  sass = require("gulp-sass"),
  cleanCSS = require("gulp-clean-css"),
  sourcemaps = require("gulp-sourcemaps"),
  concat = require("gulp-concat"),
  imagemin = require("gulp-imagemin"),
  changed = require("gulp-changed"),
  uglify = require("gulp-uglify"),
  lineEC = require("gulp-line-ending-corrector"),
  rename = require("gulp-rename"),
  notify = require("gulp-notify"),
  path = require("path");

var appUrl = path.join(__dirname, "app");

var srcPaths = {
  html: appUrl,
  scss: path.join(appUrl, "src/scss"),
  js: path.join(appUrl, "src/js"),
  images: path.join(appUrl, "src/images"),
  fonts: path.join(appUrl, "src/fonts")
};
var distPaths = {
  html: appUrl,
  css: path.join(appUrl, "dist/css"),
  js: path.join(appUrl, "dist/js"),
  images: path.join(appUrl, "dist/images"),
  fonts: path.join(appUrl, "dist/fonts")
};

/*  CSS  */
function css() {
  return gulp
    .src([srcPaths.scss + "/**/*.scss"])
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(autoprefixer({ browsers: "last 2 versions", cascade: false }))
    .pipe(sourcemaps.write())
    .pipe(lineEC())
    .pipe(gulp.dest(distPaths.css))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(distPaths.css))
    .pipe(notify("CSS Compiled Successfully"));
}

/*Javascript*/
function javascript() {
  return gulp
    .src([srcPaths.js + "/**/*.js"])
    .pipe(gulp.dest(distPaths.js))
    .pipe(uglify())
    .pipe(rename({ suffix: "min" }))
    .pipe(gulp.dest(distPaths.js));
}

/*Images*/
function images() {
  return gulp
    .src(srcPaths.images + "/**/*")
    .pipe(changed(distPaths.images))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 })
      ])
    )
    .pipe(gulp.dest(distPaths.images));
}

/*Watching Files*/
function watch() {
  browserSync.init({
    open: "external",
    server: path.join(__dirname, "app"),
    port: 8080
  });
  gulp.watch(srcPaths.scss, css);
  gulp.watch(srcPaths.js, javascript);
  gulp.watch(srcPaths.images, images);
  gulp
    .watch([distPaths.css, distPaths.js, distPaths.images, appUrl])
    .on("change", browserSync.reload);
}

exports.css = css;
exports.js = javascript;
exports.images = images;
exports.watch = watch;

gulp.task("default", watch);
