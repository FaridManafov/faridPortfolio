const {src, dest, watch, series, parallel} = require('gulp')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const concat = require('gulp-concat')
const postcss = require('gulp-postcss')
const replace = require('gulp-replace')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const browsersync = require('browser-sync').create()

const files = {
    scssPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js',
    htmlPath: 'app/index.html'
}

const scssTask = () => {
    return src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([ autoprefixer(), cssnano() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'))
        .pipe(browsersync.stream({stream: 'true'}))
}

const jsTask = () => {
    return src(files.jsPath)
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(dest('dist'))
        .pipe(browsersync.stream({stream: 'true'}))
}

const cbString = new Date().getTime()
const cacheBuster = () => {
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.'))
}

const serverRefresh = (done) => {
    browsersync.reload()
    done()
}

const serve = (done) => {
    browsersync.init({
        server:{
            baseDir: './'
        }
    })
    done()
}

const watchTask = () => {
    watch([files.scssPath, files.jsPath], series(parallel(scssTask, jsTask), serverRefresh)) //removed cachebuster atm
}

exports.default = series(parallel(scssTask, jsTask), serve, watchTask)