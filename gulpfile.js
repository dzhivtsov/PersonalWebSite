var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var del = require('del');
var gulpIf = require('gulp-if');
var inject = require('gulp-inject'); //for inject smth in future
var minifyCSS = require('gulp-minify-css');
var htmlMin = require('gulp-htmlmin');
var gutil = require('gulp-util');
var angularTemplates = require('gulp-angular-templates');
var plugins = require('gulp-load-plugins')();

var paths = {
    scripts: 'app/scripts/*.js',
    styles: ['app/styles/*.css'],
    printStyles: ['app/styles/print.css'],
    images: 'app/images/**/*',
    fonts: 'app/fonts/**/*',
    index: 'app/index.html',
    partials: ['app/views/**/*.html'],
    files: ['app/files/**/*']
};

gulp.task('clean', function () {
    del(['dist/*']);
});

gulp.task('build', ['clean'], function () {
    var assets = useref.assets();

    return gulp.src(paths.index)
        .pipe(inject(gulp.src(['app/views/ga.html']), {
            starttag: '<!-- inject:ga -->',
            removeTags: true,
            transform: function (filePath, file) {
                return file.contents.toString('utf8')
            }
        }))
        .pipe(assets)
        .pipe(gulpIf('*.css', minifyCSS({compatibility: 'ie8'})))
        .pipe(gulpIf('*.js', uglify().on('error', gutil.log)))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulpIf('*.html', htmlMin({collapseWhitespace: true, removeComments: true, minifyJS:true})))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', ['build'], function () {
    return gulp.src(paths.images)
        .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', ['images'], function () {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('printStyles', ['fonts'], function () {
    return gulp.src(paths.printStyles)
        .pipe(minifyCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/styles'))
});

gulp.task('files', ['fonts'], function () {
    return gulp.src(paths.files)
        .pipe(gulp.dest('dist/files'))
});

gulp.task('favicon', ['files'], function () {
    return gulp.src('app/favicon.ico')
        .pipe(gulp.dest('dist'))
});

gulp.task('default', ['favicon'], function () {
});