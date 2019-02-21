const gulp = require("gulp");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const babel = require("gulp-babel");

gulp.task("pack-js", function() {
    return gulp.src('client/js/*.js')
    .pipe(babel({presets: ['@babel/preset-env']}))
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest("./build"))
})

gulp.task("pack-css", function() {
    return gulp.src('client/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest("./build"))
})

gulp.task('default', gulp.parallel('pack-js', 'pack-css'))

gulp.task('watch', function() {
    gulp.watch('client/js/*.js', gulp.parallel('pack-js'))
    gulp.watch('client/css/*.scss', gulp.parallel('pack-css'))
})