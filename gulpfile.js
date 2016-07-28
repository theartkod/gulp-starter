/**
 * Created by vik_kod(vik_kod@mail.ru)
 */

'use strict';

var gulp            = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    del             = require('del'),
    browserSync     = require('browser-sync').create(),
    plugins         = gulpLoadPlugins(),
    reload          = browserSync.reload,
    nameProject     = 'nameProject';

/********************************************************************/
/*PATH***************************************************************/
/********************************************************************/

var path = {
    dist: {
        html: './dist/',
        js: './dist/js/',
        css: './dist/css/',
        img: './dist/images/',
        fonts: './dist/fonts/',
        json: './dist/json/',
        vendor: './dist/vendor/'
    },
    src: {
        html: './src/*.html',
        js: './src/js/*.js',
        style:'./src/scss/main.scss',
        img: './src/images/**',
        json: './src/json/*.json',
        fonts: ['./bower_components/font-awesome/fonts/*.*', './src/fonts/**/*'],
        vendor: './src/vendor/**/*'
    },
    watch: {
        style: './src/scss/**/*',
        js: './src/js/**/*',
        html: './src/**/*.html',
        img: './src/images/**/*',
        json: './src/json/**/*',
        vendor: './src/vendor/**/*'
    }
};

/********************************************************************/
/*SERVER*************************************************************/
/********************************************************************/

gulp.task('server', function() {
        browserSync.init({
            server: { baseDir: './dist' },
            logPrefix: nameProject,
            logFileChanges: false,
            reloadDelay: 1000,
            ghostMode: false,
            online: false
    });
});

/********************************************************************/
/*VENDOR*************************************************************/
/********************************************************************/

gulp.task('vendor', function () {
    return gulp.src(path.src.vendor)
        .pipe(gulp.dest(path.dist.vendor))
});

/********************************************************************/
/*HTML***************************************************************/
/********************************************************************/

gulp.task('html', function () {
    return gulp.src(path.src.html)
        .pipe(plugins.include())
        .pipe(plugins.removeHtmlComments())
        .pipe(plugins.replace(/^\s*\n/mg, ''))
        .pipe(gulp.dest(path.dist.html))
        .pipe(reload({stream: true}));
});

/********************************************************************/
/*JS*****************************************************************/
/********************************************************************/

gulp.task('js',  function() {
    return gulp.src(path.src.js)
        .pipe(plugins.newer(path.dist.js))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.plumber())
        .pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(path.dist.js))
        .pipe(reload({stream: true}));
});

/********************************************************************/
/*STYLES*************************************************************/
/********************************************************************/

gulp.task('style', function () {
    return gulp.src(path.src.style)
        .pipe(plugins.newer(path.dist.css))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer({browsers: ['last 10 versions'], cascade: false}))
        .pipe(plugins.csso())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(path.dist.css))
        .pipe(reload({stream: true}));
});

/********************************************************************/
/*FONTS *************************************************************/
/********************************************************************/

gulp.task('fonts', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts))
        .pipe(reload({stream: true}));
});

/********************************************************************/
/*JSON***************************************************************/
/********************************************************************/

gulp.task('json', function () {
    return gulp.src(path.src.json)
        .pipe(gulp.dest(path.dist.json))
        .pipe(reload({stream: true}));
});

/********************************************************************/
/*IMAGES*************************************************************/
/********************************************************************/

gulp.task('img', function () {
    return gulp.src(path.src.img, {since: gulp.lastRun('img')})
        .pipe(gulp.dest(path.dist.img))
        .pipe(reload({stream: true}));
});

/********************************************************************/
/*CLEAN**************************************************************/
/********************************************************************/

gulp.task('clean', function () {
    return del('./dist', {read: false})
});

/********************************************************************/
/*Watch***************************************************************/
/********************************************************************/

gulp.task('watch', function () {
    gulp.watch(path.watch.style,   gulp.series('style'));
    gulp.watch(path.watch.json,     gulp.series('json'));
    gulp.watch(path.watch.js,         gulp.series('js'));
    gulp.watch(path.watch.html,     gulp.series('html'));
    gulp.watch(path.watch.img,       gulp.series('img'));
    gulp.watch(path.watch.vendor, gulp.series('vendor'));
});

/********************************************************************/
/*Default************************************************************/
/********************************************************************/

gulp.task('default',
    gulp.series('clean','style', 'js', 'vendor', 'fonts', 'json', 'img', 'html',
        gulp.parallel ('server', 'watch'))
);