var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task("ts", function () {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest("dist"));
});
gulp.task("scripts", function () {
    return gulp.src('dist/init.js')
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});
gulp.task("window", function () {
    return gulp.src('src/window.js')
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});

gulp.watch('dist/init.js',['scripts'])

gulp.task('default', ['ts','window']);