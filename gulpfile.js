'use strict';

var gulp            = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    del             = require('del'),
    browserSync     = require('browser-sync').create(),
    plugins         = gulpLoadPlugins(),
    reload          = browserSync.reload,
    nameProject     = 'nameProject';

//=======================================================
//                   Path config
//=======================================================

var path = {
    dist: {
        html: './dist',
        js: './dist/js',
        css: './dist/css',
        img: './dist/images/',
        fonts: './dist/fonts',
        json: './dist/json',
        vendor: './dist/vendor'
    },
    src: {
        html: './src/*.html',
        js: './src/js/*.js',
        style:'./src/scss/main.scss',
        img: './src/images/**',
        json: './src/json/*.json',
        fonts: ['./bower_components/font-awesome/fonts/*.*',
            './src/fonts/*'],
        vendor: './src/vendor/*'
    },
    watch: {
        style: './src/scss/*.scss',
        js: './src/js/*.js',
        html: './src/**/*.html',
        img: './src/images/*',
        json: './src/images/*',
        vendor: './src/vendor/*'
    }
};

//=======================================================
//                      Serve
//=======================================================

gulp.task('server', function() {
        browserSync.init({
            server: { baseDir: './dist' },
            logPrefix: nameProject,
            logFileChanges: false,
            reloadDelay: 1000,
            ghostMode: false
    });
});

//=======================================================
//                        Vendor
//=======================================================

gulp.task('vendor', function () {
    return gulp.src(path.src.vendor)
        .pipe(gulp.dest(path.dist.vendor))
});

//=======================================================
//                        HTML
//=======================================================

gulp.task('html', function () {
    return gulp.src(path.src.html)
        .pipe(plugins.include())
        .pipe(plugins.removeHtmlComments())
        .pipe(plugins.replace(/^\s*\n/mg, ''))
        .pipe(gulp.dest(path.dist.html))
        .pipe(reload({stream: true}));
});

//=======================================================
//                     JavaScript
//=======================================================

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

//=======================================================
//                      Style
//=======================================================

gulp.task('style', function () {
    return gulp.src(path.src.style)
        .pipe(plugins.newer(path.dist.css))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
        .pipe(plugins.csso())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(path.dist.css))
        .pipe(reload({stream: true}));
});

//=======================================================
//                       Fonts
//=======================================================

gulp.task('fonts', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});

//=======================================================
//                       JSON
//=======================================================

gulp.task('json', function () {
    return gulp.src(path.src.json)
        .pipe(gulp.dest(path.dist.json))
});

//=======================================================
//                       Images
//=======================================================

gulp.task('img', function () {
    return gulp.src(path.src.img, {since: gulp.lastRun('img')})
        .pipe(gulp.dest(path.dist.img));
});

//=======================================================
//                Clean dist folder
//=======================================================

gulp.task('clean', function () {
    return del('./dist', {read: false})
});

//=======================================================
//                        Watch
//=======================================================

gulp.task('watch', function () {
    gulp.watch(path.watch.style,   gulp.series('style'));
    gulp.watch(path.watch.json,     gulp.series('json'));
    gulp.watch(path.watch.js,         gulp.series('js'));
    gulp.watch(path.watch.html,     gulp.series('html'));
    gulp.watch(path.watch.img,       gulp.series('img'));
    gulp.watch(path.watch.vendor, gulp.series('vendor'));
});

//=======================================================
//                    zip task
//=======================================================

gulp.task('zip', function () {
    return gulp.src('../template_project/**/*')
        .pipe(plugins.debug({title: 'zip:'}))
        .pipe(plugins.zip(nameProject + '.zip'))

        .pipe(gulp.dest('../'));
});

//=======================================================
//                    Default task
//=======================================================

gulp.task('default',
    gulp.series('clean','style', 'js', 'vendor', 'fonts', 'json', 'img', 'html',
        gulp.parallel ('server', 'watch'))
);