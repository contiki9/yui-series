//----------------------------------------------------
// gulp: Setting
//----------------------------------------------------



// gulp
const gulp = require('gulp');


// Sass
const sass = require('gulp-sass');
const sassGlob = require("gulp-sass-glob");
const pleeease = require('gulp-pleeease');
const plumber = require('gulp-plumber');
const packageImporter = require('node-sass-package-importer');

//browserSync
const browserSync = require('browser-sync');


//////////////////////////////
// config
//////////////////////////////

//開発用ディレクトリ
var develop = {
    'root': './src/',
    'assets': './src/assets/'
};

//コンパイル先
var release = {
    'root': './dist/',
    'css': './dist/assets/css/',
    'assets': './dist/assets/'
};


const browserSyncWatchFiles = [
    develop.root + './**/*.pug',
    develop.assets + '**/scss/*.scss',
    release.root + '**/css/*.css',
    release.root + '**/js/*.js',
    //release.root + '**/*.php',
    //release.root + '**/*.html'
];

const browserSyncOptions = {
    //proxy: "localhost/wordpress/",
    notify: false,
    server: {
        baseDir: './docs/',
        index: 'index.html'
    },
    open:false//オプション
};

const AUTOPREFIXER_BROWSERS = [
    // @see https://github.com/ai/browserslist#browsers
    // Major Browsers（主要なブラウザの指定）
    'last 2 version', // （Major Browsersの）最新2バージョン
    'ie >= 11', // IE9以上
    'iOS >= 7', // iOS7以上
    'Android >= 5.0' // Android4.0以上
];

//////////////////////////////
// Task
//////////////////////////////

// //scss compile
gulp.task('sass', function () {
    console.log('--------- sass task ----------');
    return gulp.src([
        develop.assets + 'scss/**/*.scss',
        '!' + develop.assets + 'scss/vendor/**/*.scss'
    ]).pipe(sassGlob())
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err.messageFormatted);
                this.emit('end');
            }
        }))
        .pipe(sass({
            importer: packageImporter({
                extensions: ['.scss', '.css']
            })
        }))
        .pipe(pleeease({
            autoprefixer: {"browsers": AUTOPREFIXER_BROWSERS},
            minifier: true,
        }))
        .pipe(gulp.dest(release.css));
});

// browserSync
gulp.task('browser-sync', function (done) {
    console.log('--------- browser-sync task ----------');
    browserSync.init(browserSyncWatchFiles, browserSyncOptions);
    done();
});
gulp.task('reload', function (done) {
    console.log('--------- reload task ----------');
    browserSync.reload();
    done();
});

gulp.task('watch', gulp.series( 'browser-sync', function() {
    gulp.watch(develop.assets +'scss/*.scss', gulp.task('sass'));
} ));


