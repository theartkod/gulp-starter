/**
 * Created by vik_kod(vik_kod@mail.ru)
 */

'use strict';

const gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    plugins = gulpLoadPlugins(),
    Pageres = require('pageres'),
    reload = browserSync.reload,
    psi = require('psi'),
    mainBowerFiles = require('main-bower-files'),
    nameProject = 'nameProject';



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
        vendor: './dist/vendor/',
        imgSet: './dist/images/src-set/'
    },
    src: {
        html: './src/*.html',
        js: './src/js/*.js',
        style: './src/scss/*.scss',
        img: './src/images/**/*',
        json: './src/json/*.json',
        fonts: './src/fonts/**/*',
        imgSet: './src/images/src-set/**/*'
    },
    watch: {
        style: './src/scss/**/*',
        js: './src/js/**/*',
        html: './src/**/*.html',
        img: './src/images/**/*',
        json: './src/json/**/*',
        vendor: 'bower.json',
        imgSet: './src/images/src-set/**/*'
    }
};

/********************************************************************/
/*VENDOR-PATH*********************************************************/
/********************************************************************/
var bowerConfig = {
    "bootstrap": {
        "main": ['./scss/**/*', './dist/js/bootstrap.min.js']
    },
    "jquery": {
        "main": './dist/jquery.min.js'
    },
    "tether": {
        "main": './dist/js/tether.min.js'
    },
    "font-awesome": {
        "main": ['./fonts/**/*', './css/font-awesome.min.css']
    },

    "bourbon": {
        "main": './app/assets/**/*'
    },

    "magnific-popup": {
        "main": ['./dist/jquery.magnific-popup.min.js', './dist/magnific-popup.css']
    },

    "owl.carousel": {
        "main": ['./dist/assets/*.min.css', './dist/owl.carousel.min.js']
    },

    "Detect.js": {
        "main": ['./detect.min.js']
    },

    "jquery.stellar": {
        "main": ['./src/jquery.stellar.js']
    },

    "mixitup": {
        "main": ['./build/jquery.mixitup.min.js']
    },

    "css-hamburgers": {
        "main": ['./dist/hamburgers.min.css']
    },

    "photoswipe": {
        "main": ['./dist/**/*']
    },

    "swipebox": {
        "main": ['./src/**/*']
    }
};

/********************************************************************/
/*IMG-SET************************************************************/
/********************************************************************/

gulp.task('imgSet', function () {
    return gulp.src(path.src.imgSet)
        .pipe(plugins.responsive({
            '*.*': [{
                width: 544,
                rename: {suffix: '-xs'},
            }, {
                width: 768,
                rename: {suffix: '-sm'},
            }, {
                width: 992,
                rename: {suffix: '-md'},
            }, {
                width: 1200,
                rename: {suffix: '-lg'},
            }, {
                width: 1920,
                rename: {suffix: '-xl'},
            }]
        }, {
            quality: 100,
            progressive: true,
            withMetadata: false,
        }))
        .pipe(gulp.dest(path.dist.imgSet));
});

/********************************************************************/
/*SERVER*************************************************************/
/********************************************************************/

gulp.task('server', function () {
    return browserSync.init({
        server: {baseDir: './dist'},
        logPrefix: nameProject,
        logFileChanges: false,
        reloadDelay: 1000,
        ghostMode: false,
        online: true
    });
});

/********************************************************************/
/*VENDOR*************************************************************/
/********************************************************************/

gulp.task('vendor', function () {
    return gulp.src(mainBowerFiles({"overrides": bowerConfig}), {base: './bower_components'})
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

gulp.task('js', function () {
    return gulp.src(path.src.js)
        .pipe(plugins.newer(path.dist.js))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.babel({presets: ['es2015']}))
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
    return del(['./dist', './src/vendor/**/*'], {read: false})
});

/********************************************************************/
/*WATCH**************************************************************/
/********************************************************************/

gulp.task('watch', function () {
    gulp.watch(path.watch.style,   gulp.series('style'));
    gulp.watch(path.watch.json,     gulp.series('json'));
    gulp.watch(path.watch.js,         gulp.series('js'));
    gulp.watch(path.watch.html,     gulp.series('html'));
    gulp.watch(path.watch.img,       gulp.series('img'));
    gulp.watch(path.watch.imgSet, gulp.series('imgSet'));
    gulp.watch(path.watch.vendor, gulp.series('vendor'));
});

gulp.task('psi', function () {
    return psi('google.com').then(data => {
        console.log(data.ruleGroups.SPEED.score);
        console.log(data.pageStats);
    });
});

/********************************************************************/
/*DEFAULT************************************************************/
/********************************************************************/

gulp.task('default',
    gulp.series('clean', 'img', 'imgSet', 'style', 'js', 'vendor', 'fonts', 'json', 'html',
        gulp.parallel('server', 'watch'))
);




/*

// get the PageSpeed Insights report
psi('http://localhost:3000').then(data => {
    console.log(data.ruleGroups.SPEED.score);
    console.log(data.pageStats);
});
*/
