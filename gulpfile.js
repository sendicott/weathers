
let gulp = require('gulp');
let sass = require('gulp-sass');
let browserify = require('gulp-browserify');

gulp.task('default', ['html', 'css', 'js']);

gulp.task('html', function () {
    return gulp.src(['index.html', 'components/*.html'], { base: './' })
        .pipe(gulp.dest('public/'));
});

gulp.task('css', function () {
    return gulp.src('style.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/'));
});

gulp.task('js', function () {
    return gulp.src('app.js')
        .pipe(browserify())
        .pipe(gulp.dest('public/'));
});

gulp.task('watch', function () {
    gulp.watch('index.html', ['html']);
    gulp.watch('components/*.html', ['html']);
    gulp.watch('app.js', ['js']);
    gulp.watch('*.scss', ['css']);
    gulp.watch('stylenuggets/*.scss', ['css']);
});