/**
 * Created by vik_kod(vik_kod@mail.ru)
 */

'use strict';

const
    gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    plugins = gulpLoadPlugins(),
    Pageres = require('pageres'),
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
        "main": ['./dist/css/bootstrap-grid.min.css', './dist/css/bootstrap-reboot.min.css']
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

gulp.task('server', () => {
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

gulp.task('vendor', () => {
    return gulp.src(mainBowerFiles({"overrides": bowerConfig}), {base: './bower_components'})
        .pipe(gulp.dest(path.dist.vendor))
});

/********************************************************************/
/*HTML***************************************************************/
/********************************************************************/

gulp.task('html', () => {
    return gulp.src(path.src.html )
        .pipe(plugins.include())
        .pipe(plugins.removeHtmlComments())
        .pipe(plugins.replace(/^\s*\n/mg, ''))
        .pipe(gulp.dest(path.dist.html))
        .pipe(browserSync.stream());
});

/********************************************************************/
/*JS:BUILD***********************************************************/
/********************************************************************/

gulp.task('js:build', () => {
    return gulp.src(path.src.js)
        .pipe(plugins.babel({presets: ['es2015']}))
        .pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest(path.dist.js))
});

/********************************************************************/
/*JS:DEV*************************************************************/
/********************************************************************/

gulp.task('js:dev', () => {
    return gulp.src(path.src.js)
        .pipe(plugins.newer(path.dist.js))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.babel({presets: ['es2015']}))
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(path.dist.js))
        .pipe(browserSync.stream());
});

/********************************************************************/
/*STYLE:BUILD********************************************************/
/********************************************************************/

gulp.task('style:build', () => {
    return gulp.src(path.src.style)
        .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer({browsers: ['last 3 versions'], cascade: false}))
        .pipe(plugins.csso())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest(path.dist.css))
});

/********************************************************************/
/*STYLE:DEV**********************************************************/
/********************************************************************/

gulp.task('style:dev', () => {
    return gulp.src(path.src.style)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer({browsers: ['last 3 versions'], cascade: false}))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(path.dist.css))
        .pipe(browserSync.stream());
});

/********************************************************************/
/*FONTS *************************************************************/
/********************************************************************/

gulp.task('fonts', () => {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts))
        .pipe(browserSync.stream());
});

/********************************************************************/
/*IMAGES*************************************************************/
/********************************************************************/

gulp.task('img', () => {
    return gulp.src(path.src.img, {since: gulp.lastRun('img')})
        .pipe(gulp.dest(path.dist.img))
        .pipe(browserSync.stream());
});

/********************************************************************/
/*CLEAN**************************************************************/
/********************************************************************/

gulp.task('clean', () => {
    return del(['./dist'], { read: false })
});

/********************************************************************/
/*WATCH**************************************************************/
/********************************************************************/

gulp.task('watch', () => {
    gulp.watch(path.watch.style, gulp.series('style:dev'));
    gulp.watch(path.watch.js,       gulp.series('js:dev'));
    gulp.watch(path.watch.html,       gulp.series('html'));
    gulp.watch(path.watch.img,         gulp.series('img'));
    gulp.watch(path.watch.vendor,   gulp.series('vendor'));
});

/********************************************************************/
/*DEV****************************************************************/
/********************************************************************/

gulp.task('dev',
    gulp.series('clean', 'img', 'style:dev', 'js:dev', 'vendor', 'fonts', 'html',
        gulp.parallel('server', 'watch'))
);

/********************************************************************/
/*BUILD**************************************************************/
/********************************************************************/

gulp.task('build',
    gulp.series('clean', 'img', 'style:build', 'js:build', 'vendor', 'fonts',  'html')
);
