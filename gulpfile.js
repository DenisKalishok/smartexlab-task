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


/**
 * Parameters
 */
const BUILD_TASK = 'build-task';
const DEV_TASK = 'dev-task';

const DIST_PATH = 'dist';
const VENDOR_PATH = 'bower_components';
const SCRIPT_PATH = 'src';
const VENDOR_SCRIPT_FILE = 'vendor.js';
const APP_SCRIPT_FILE = 'script.js';
const TEMPLATES_MASK = `${SCRIPT_PATH}/**/*.template.html`;

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
    `${SCRIPT_PATH}/users/user.module.js`,
    `${SCRIPT_PATH}/users/list/list.controller.js`,
    `${SCRIPT_PATH}/users/list/list.component.js`,
    `${SCRIPT_PATH}/users/detail/detail.controller.js`,
    `${SCRIPT_PATH}/users/detail/detail.component.js`,
    `${SCRIPT_PATH}/app.module.js`
];


/**
 * Tasks
 */
gulp.task('clean', function () {
    return clean(DIST_PATH);
});
gulp.task('build:vendor-script', buildVendorScript);
gulp.task('build:app-script', buildAppScript);
gulp.task('copy:index', copy.bind(null, 'index.html'));
gulp.task('copy:favicon', copy.bind(null, 'favicon.ico'));

gulp.task(DEV_TASK, ['clean'], function () {
    sequence(
        'build:vendor-script',
        'build:app-script',
        'copy:index',
        'copy:favicon'
    );
});

/**
 * Global tasks
 **/
gulp.task('default', [DEV_TASK]);
gulp.task('build', [DEV_TASK]);


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
