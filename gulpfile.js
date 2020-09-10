const {src, dest, watch, series, parallel} = require('gulp')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const browsersync = require('browser-sync').create()

const files = {
    scssPath: './app/scss/*.scss',
    jsPath: './app/js/*.js',
    htmlPath: './app/index.html'
}

const serve = () => {
    browsersync.init({
        server:{
            baseDir: './app'
        }
    })
    watch([files.scssPath, files.jsPath], series(scssTask, jsTask))
    watch([files.scssPath, files.jsPath]).on('change', browsersync.reload)
}

const scssTask = () => {
    return src(files.scssPath)
        .pipe(sass())
        .pipe(dest('./app/dist/css'))
        .pipe(browsersync.stream())
}

const jsTask = () => {
    return src(files.jsPath)
        .pipe(uglify())
        .pipe(dest('./app/dist/js'))
        .pipe(browsersync.stream())
}

exports.default = series(scssTask, jsTask, serve)