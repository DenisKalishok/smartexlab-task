'use strict';

/**
 * Plugins
 */
const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const html2js = require('gulp-ng-html2js');
const wrap = require('gulp-wrap');
const uglify = require('gulp-uglify');
const minifyHTML = require('gulp-minify-html');
const merge = require('merge2');
const sequence = require('run-sequence');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const jshint = require('gulp-jshint');


/**
 * Parameters
 */
const BUILD_TASK = 'build-task';
const DEV_TASK = 'dev-task';
const LINT_TASK = 'lint-task';

const DIST_PATH = 'dist';
const VENDOR_PATH = 'bower_components';
const SCRIPT_PATH = 'src';
const VENDOR_SCRIPT_FILE = 'vendor.js';
const APP_SCRIPT_FILE = 'script.js';
const VENDOR_CSS_FILE = 'vendor.css';
const APP_CSS_FILE = 'app.css';
const INDEX_FILE = 'index.html';
const TEMPLATES_MASK = `${SCRIPT_PATH}/**/*.template.html`;

const SASS_OPTIONS = {
    outputStyle: 'compressed',
    precision: 2,
    sourceComments: false
};

const VENDOR_FILES = [
    `${VENDOR_PATH}/tether/dist/js/tether.min.js`,
    `${VENDOR_PATH}/jquery/dist/jquery.min.js`,
    `${VENDOR_PATH}/bootstrap/dist/js/bootstrap.min.js`,
    `${VENDOR_PATH}/angular/angular.min.js`,
    `${VENDOR_PATH}/angular-route/angular-route.min.js`,
    `${VENDOR_PATH}/angular-bootstrap/ui-bootstrap.min.js`,
    `${VENDOR_PATH}/angular-bootstrap/ui-bootstrap-tpls.min.js`,
    `${VENDOR_PATH}/angular-smart-table/dist/smart-table.min.js`
];

const SCRIPT_FILES = [
    // users
    `${SCRIPT_PATH}/users/**/*.module.js`,
    `${SCRIPT_PATH}/users/**/*.controller.js`,
    `${SCRIPT_PATH}/users/**/*.component.js`,
    // app run module
    `${SCRIPT_PATH}/app.module.js`
];

const VENDOR_CSS_FILES = [
    `${VENDOR_PATH}/normalize.css/normalize.css`,
    `${VENDOR_PATH}/bootstrap/dist/css/bootstrap.min.css`,
    `${VENDOR_PATH}/bootstrap/dist/css/bootstrap-grid.min.css`
];

const APP_CSS_FILES = [`${SCRIPT_PATH}/**/*.scss`];


/**
 * Tasks
 */
gulp.task('clean', clean.bind(null, DIST_PATH));
gulp.task('build:vendor-script', buildVendorScript);
gulp.task('build:app-script', buildAppScript);
gulp.task('build:vendor-css', buildCss.bind(null, VENDOR_CSS_FILE, VENDOR_CSS_FILES));
gulp.task('build:app-css', buildCss.bind(null, APP_CSS_FILE, APP_CSS_FILES));
gulp.task('copy:index', copy.bind(null, INDEX_FILE));
gulp.task('copy:favicon', copy.bind(null, 'favicon.ico'));
gulp.task('watch', watch);
gulp.task(LINT_TASK, lint);

gulp.task(BUILD_TASK, ['clean'], function () {
    sequence(
        'lint',
        'build:vendor-script',
        'build:app-script',
        'build:vendor-css',
        'build:app-css',
        'copy:index',
        'copy:favicon'
    );
});

gulp.task(DEV_TASK, [BUILD_TASK], function () {
    sequence('watch');
});

/**
 * Global tasks
 **/
gulp.task('default', [DEV_TASK]);
gulp.task('dev', [DEV_TASK]);
gulp.task('build', [BUILD_TASK]);
gulp.task('lint', [LINT_TASK]);


/**
 * Functions
 */
function clean(folder) {
    return del.sync(folder, {force: true});
}

function copy(fileList) {
    return gulp
        .src(fileList)
        .pipe(gulp.dest(DIST_PATH));
}

function buildVendorScript() {
    return gulp
        .src(VENDOR_FILES)
        .pipe(concat(VENDOR_SCRIPT_FILE))
        .pipe(gulp.dest(DIST_PATH));
}

function buildAppScript() {
    const wrapString = '(function(undefined){\n\'use strict\';\n<%= contents %>\n})();';
    const tasks = [
        gulp
            .src(TEMPLATES_MASK, {base: '.'})
            .pipe(minifyHTML({
                empty: true,
                comments: true,
                conditionals: true,
                spare: true,
                quotes: true,
                loose: true
            }))
            .pipe(html2js({moduleName: 'templates'})),
        gulp
            .src(SCRIPT_FILES)
            .pipe(wrap(wrapString, {}, {parse: false}))
    ];

    return merge
        .apply(null, tasks)
        .pipe(concat(APP_SCRIPT_FILE))
        .pipe(uglify())
        .pipe(gulp.dest(DIST_PATH));
}

function buildCss(fileName, cssFileList) {
    return gulp
        .src(cssFileList, {base: '.'})
        .pipe(concat(fileName))
        .pipe(sass(SASS_OPTIONS))
        .pipe(postcss([autoprefixer({browsers: ['last 2 version']})]))
        .pipe(gulp.dest(DIST_PATH));
}

function watch() {
    gulp.watch(APP_CSS_FILES, ['build:app-css']);
    gulp.watch(SCRIPT_FILES.concat(TEMPLATES_MASK), ['lint', 'build:app-script']);
    gulp.watch(INDEX_FILE, ['copy:index']);
}

function lint() {
    return gulp
        .src(APP_CSS_FILES.concat(SCRIPT_FILES))
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
}
