var gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  reload = browserSync.reload,
  sass = require("gulp-sass"),
  cleanCSS = require("gulp-clean-css"),
  sourcemaps = require("gulp-sourcemaps"),
  imagemin = require("gulp-imagemin"),
  changed = require("gulp-changed"),
  uglify = require("gulp-uglify"),
  lineEC = require("gulp-line-ending-corrector"),
  rename = require("gulp-rename"),
  notify = require("gulp-notify"),
  path = require("path"),
  htmlmin = require("gulp-htmlmin"),
  purgecss = require("gulp-purgecss");

var appUrl = path.join(__dirname, "app");

var srcPaths = {
  html: path.join(appUrl, "src"),
  scss: path.join(appUrl, "src/scss"),
  js: path.join(appUrl, "src/js"),
  images: path.join(appUrl, "src/images"),
  fonts: path.join(appUrl, "src/fonts")
};
var distPaths = {
  html: path.join(appUrl, "dist"),
  css: path.join(appUrl, "dist/css"),
  js: path.join(appUrl, "dist/js"),
  images: path.join(appUrl, "dist/images"),
  fonts: path.join(appUrl, "dist/fonts")
};

/*HTML*/

function html() {
  return gulp
    .src([srcPaths.html + "/**/*.html"])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(distPaths.html));
}
/*CSS*/
function scss() {
  return gulp
    .src([srcPaths.scss] + "/**/*.scss")
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(sourcemaps.write())
    .pipe(lineEC())
    .pipe(gulp.dest(distPaths.css))
    .pipe(purgecss({ content: [`${srcPaths.html}/**/*.html`] }))
    .pipe(gulp.dest(distPaths.css))
    .pipe(cleanCSS())
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
    .pipe(rename({ suffix: ".min" }))
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
    server: path.join(appUrl, "dist"),
    port: 8080
  });
  gulp.watch(srcPaths.html, gulp.series(html, scss, javascript));
  gulp.watch(srcPaths.scss, scss);
  gulp.watch(srcPaths.js, javascript);
  gulp.watch(srcPaths.images, images);
  gulp
    .watch([distPaths.css, distPaths.js, distPaths.images, distPaths.html])
    .on("change", reload);
}

exports.scss = scss;
exports.js = javascript;
exports.images = images;
exports.watch = watch;
exports.html = html;

gulp.task("default", watch);
