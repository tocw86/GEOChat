var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

const paths = {
    scripts: {
      src: [
          'temp/app/helpers/notify.js',
          'temp/app/geo/*.js',
          'temp/app/user/user.js',
          'temp/app/transport/*.js',
          'temp/init.js',
          'src/app/views/window.js',
        ],
    }
  };
//Sass
gulp.task('sass', function () {
    return gulp.src([
            'assets/sass/style.scss'
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
            remove: false,
        }))
        .pipe(minifyCSS())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('assets/css'));
});

gulp.task("ts", function () {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest("temp"));
});
gulp.task("scripts", function () {
    return gulp.src(paths.scripts.src, {sourcemaps: true})
        .pipe(uglify())
        .pipe(concat('core.min.js'))
        .pipe(gulp.dest("dist"));
});
gulp.task("window", function () {
    return gulp.src('src/window.js')
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});
gulp.task("warehouse", function () {
    return gulp.src('temp/app/user/warehouse.js')
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});

gulp.task('watch', function () {
    gulp.watch('src/*.ts', ['ts'])
    gulp.watch('dist/init.js', ['scripts'])
    gulp.watch('src/window.js', ['scripts'])
    gulp.watch('assets/sass/style.scss', ['sass']);
});


gulp.task('default', ['ts', 'window', 'sass', 'warehouse','scripts','watch']);