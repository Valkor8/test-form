"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require('gulp-sass');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const terser = require('gulp-terser');
const htmlmin = require("gulp-htmlmin");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const sync = require("browser-sync").create();

// Styles

const styles = () => {
    return gulp.src("source/sass/style.scss")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(gulp.dest("source/css"))
        .pipe(postcss([
            autoprefixer(),
            csso()
        ]))
        .pipe(rename("style.min.css"))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("build/css"))
        .pipe(sync.stream());
}

exports.styles = styles;

const stylesNormalize = () => {
  return gulp.src("source/css/normalize/normalize.css")
      .pipe(gulp.dest("source/css/normalize"))
      .pipe(postcss([
          autoprefixer(),
          csso()
      ]))
      .pipe(rename("normalize.min.css"))
      .pipe(gulp.dest("build/css"))
      .pipe(sync.stream());
}

exports.stylesNormalize = stylesNormalize;

// HTML
const html = () => {
    return gulp.src("source/*.html")
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("build"))
}

// Scripts

const scripts = () => {
    return gulp.src("source/js/*.js")
        .pipe(sourcemap.init())
        .pipe(terser())
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("build/js"))
        .pipe(sync.stream());
}

exports.scripts = scripts;

// Images

const images = () => {
    return gulp.src("source/img/**/*.{jpg,png,svg}")
        .pipe(imagemin([
            imagemin.mozjpeg({progressive: true}),
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest("build/img"));
}

exports.images = images;

// Webp

const createWebp = () => {
    return gulp.src("source/img/**/*.{jpg,png}")
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// Sprite

const sprite = () => {
    return gulp.src("source/img/icons/*.svg")
        .pipe(svgstore())
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("build/img"));
}

exports.sprite = sprite;

// Copy

const copy = () => {
    return gulp.src([
        "source/fonts/*.{woff2,woff}",
        "source/*.ico",
        "source/img/**/*.{jpg,png,svg}"
    ],
        {
            base: "source"
        })
        .pipe(gulp.dest("build"));
}

exports.copy = copy;

// Clean

const clean = () => {
    return del ("build");
}

exports.clean = clean;

//  Server

const server = (done) => {
    sync.init({
        server: {
            baseDir: "build"
        },
        notify: false,
        cors: true,
        ui: false
    });
  done();
}

exports.styles = styles;

// Watcher

const watcher = () => {
    gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
    gulp.watch("source/js/*.js", gulp.series(scripts)); // Из-за неработающего uglify
    gulp.watch("source/*.html", gulp.series(html)).on("change", sync.reload);
}

// Build
const build = gulp.series(
    clean,
    gulp.parallel(
        styles,
        stylesNormalize,
        html,
        sprite,
        copy,
        images,
        scripts,
        createWebp,
        images
    )
)

exports.build = build;

exports.default = gulp.series(
    clean,
    gulp.parallel(
        styles,
        stylesNormalize,
        sprite,
        html,
        copy,
        scripts
    ),
    gulp.series(
        server, watcher
    )
)
