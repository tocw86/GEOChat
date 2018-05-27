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
    return gulp.src('dist/*.js')
        .pipe(concat('core.js'))
        .pipe(uglify())
        .pipe(gulp.dest("core"));
});

gulp.task('default', ['ts']);