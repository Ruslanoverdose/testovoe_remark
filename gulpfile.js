const gulp = require('gulp')
const sass = require('gulp-sass')
const watch = require('gulp-watch');
const autoprefixer  =  require('gulp-autoprefixer')
const cleanCss  =  require('gulp-clean-css')
const concat  =  require('gulp-concat')
const merge = require('merge-stream')
const minify = require('gulp-minify')
const imagemin = require('gulp-imagemin');

//Таск на стили CSS, SASS
function styles() {

    const cssStream = gulp.src("src/css/*.css")
        .pipe(concat('cssFiles.css'))

    const sassStream = gulp.src("src/sass/*.sass")
        .pipe(sass())
        .pipe(concat('sassFiles.sass'))

    const scssStream = gulp.src("src/scss/*.scss")
        .pipe(sass())
        .pipe(concat('scssFiles.scss'))

    const mergeStream = merge(cssStream, scssStream, sassStream )
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('all.min.css'))
        .pipe(cleanCss({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('build/css'))
    return mergeStream
}

//Таск на скрипты JS
function scripts() {
    return gulp.src("src/js/*.js")
    .pipe(concat("scripts.js"))
    .pipe(minify())
    .pipe(gulp.dest("build/js"))
}

function images() {
    const img = gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images/'))
    return img

}
gulp.task('callback', function () {
    // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
    const css = watch(['src/css/**/*.css','src/sass/**/*.sass', 'src/scss/**/*.scss'], styles);
    const js = watch('src/js/**/*.js', scripts);
    const img = watch('src/images/*.*', images );
    const mergeWatches = merge(css, js, img)
    return mergeWatches
});