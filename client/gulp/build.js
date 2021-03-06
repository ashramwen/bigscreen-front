'use strict';

var gulp = require('gulp');

var paths = gulp.paths;
var sass = require('gulp-sass');
var modifyCssUrls = require('gulp-modify-css-urls');
var imagemin = require('gulp-imagemin');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function() {
    return gulp.src([
            paths.src + '/{app,components}/**/*.html',
            paths.tmp + '/{app,components}/**/*.html'
        ])
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: gulp.appName
        }))
        .pipe(gulp.dest(paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function() {
    var partialsInjectFile = gulp.src(paths.tmp + '/partials/templateCacheHtml.js', { read: false });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: paths.tmp + '/partials',
        addRootSlash: true
    };

    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src(paths.tmp + '/serve/*.html')
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe(assets = $.useref.assets())
        .pipe($.rev())
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify({ preserveComments: $.uglifySaveLicense }))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(modifyCssUrls({
            modify: function(url, filePath) {
                return '..' + url;
            }
        }))
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(htmlFilter)
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(htmlFilter.restore())
        .pipe(gulp.dest(paths.dist + '/'))
        .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('images', function() {
    return gulp.src(paths.src + '/images/**/*')
        // .pipe(imagemin())
        .pipe(gulp.dest(paths.dist + '/images/'));
});

gulp.task('fonts', function() {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('misc', function() {
    return gulp.src(paths.src + '/**/*.ico')
        .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('clean', function(done) {
    $.del([paths.tmp + '/'], done);
});

gulp.task('cleanDist', function(done) {
    $.del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('config', function() {
    return gulp.src(paths.src + '/config.js')
        .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('sass', function() {
    return gulp.src(paths.src + '/app/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.src + '/css'));
});

gulp.task('buildDist', ['html', 'images', 'misc', 'fonts', 'config']);
gulp.task('build', ['sass', 'inject', 'partials', 'watch']);

gulp.task('dist', ['cleanDist'], function() {
    gulp.start(['beforeDist']);
});
gulp.task('beforeDist', ['sass', 'config', 'inject', 'partials'], function() {
    gulp.start(['buildDist']);
});