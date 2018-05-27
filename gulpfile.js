var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task("default", function () {
    return gulp.src([
        'src/.d.ts',
        'src/Auth.ts',
        'src/Main.ts',
        'src/Transport.ts',
    ])
    .pipe(ts({
        module:'system',
        noImplicitAny: true,
        out: 'core.js'
    }))
        .pipe(gulp.dest("dist"));
});