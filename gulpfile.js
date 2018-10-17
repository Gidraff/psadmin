"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // Runs a local dev server
var open = require('gulp-open'); // Open a url in a web
var browserify = require('browserify'); // Bundles js
var reactify = require('reactify'); // Transform React JSX to js
var source = require('vinyl-source-stream'); // Use conventional text streams with gulp
var concat = require('gulp-concat'); // Concatenate files
var lint = require('gulp-eslint'); // lint JS and jsx


var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dist: './dist',
        mainJs: './src/main.js'
    }
}

//  Start a local development server
gulp.task('connect', function() {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

// Runs after starting dev server
gulp.task('open', ['connect'], function() {
    gulp.src('dist/index.html')
        .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/' }));
});

// Moves src/index.html to dist folder
gulp.task('html', function() {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

// Browserify Bundles all js into one file and put it in script folder under dist
gulp.task('js', function() {
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload());
})

// css task (bundles css into a single file)
gulp.task('css', function() {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'));
})

// Lint task
gulp.task('lint', function() {
    return gulp.src(config.paths.js)
        .pipe(lint({ config: 'eslint.config.json' }))
        .pipe(lint.format());
})

// watch files
gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']); // watched html path and if anything changes the html task will be run
    gulp.watch(config.paths.js, ['js', 'lint']);
});

// default gulp task
gulp.task('default', ['html', 'js', 'css', 'lint', 'open', 'watch']);