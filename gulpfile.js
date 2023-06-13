const { src, dest, parallel, series, watch } = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')(require('sass'))
const htmlmin = require('gulp-htmlmin');
const notify = require('gulp-notify')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()
const fileinclude = require('gulp-file-include')
const svgSprite = require('gulp-svg-sprite')
const ttf2woff = require('gulp-ttf2woff')
const ttf2woff2 = require('gulp-ttf2woff2')
const fs = require('fs')
const del = require('del')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const uglify = require('gulp-uglify-es').default
const tiny = require('gulp-tinypng-compress')

const fonts = () => {
  src('./src/fonts/**.ttf')
    .pipe(ttf2woff())
    .pipe(dest('./app/fonts/'))
  return src('./src/fonts/**.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('./app/fonts/'))
}

const cb = () => { }
let srcFonts = './src/scss/_fonts.scss'
let appFonts = './app/fonts/'

const fontsStyle = (done) => {
  let fine_content = fs.readFileSync(srcFonts)

  fs.writeFile(srcFonts, '', cb);
  fs.readdir(appFonts, function (err, items) {
    if (items) {
      let c_fontname;
      for (let i = 0; i < items.length; i++) {
        let fontname = items[i].split('.')
        fontname = fontname[0]
        if (c_fontname != fontname) {
          fs.appendFile(srcFonts, '@include font-face("' + fontname + '", "' + fontname + '", 400);\r\n', cb);
        }
        c_fontname = fontname;
      }
    }
  })

  done();
}

const svgSprites = () => {
  return src('./src/img/**.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('./app/img'))
}

const styles = () => {
  return src(['./src/scss/**/*.scss', './src/scss/**/*.css'])
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2,
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/css/'))
    .pipe(browserSync.stream())
}

const htmlInclude = () => {
  return src(['./src/index.html', './src/index_press.html', './src/index_galery.html'])
    .pipe(fileinclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('./app'))
    .pipe(browserSync.stream())
}

const imgToApp = () => {
  return src(['./src/img/**.jpg', './src/img/**.JPG', './src/img/**.png', './src/img/**.jpeg', './src/img/**.mp4', './src/img/**.webp'])
    .pipe(dest('./app/img'))
}

const resources = () => {
  return src('./src/resources/**')
    .pipe(dest('./app'))
}

const clean = () => {
  return del(['app/*'])
}

const scripts = () => {
  return src('./src/js/main.js', './src/js/accordion.min.js')
    .pipe(webpackStream({
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }]
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify().on("error", notify.onError()))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream())
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: "./app"
    }
  });

  watch('./src/scss/**/*.scss', styles)
  watch('./src/index.html', htmlInclude)
  watch('./src/index_galery.html', htmlInclude)
  watch('./src/index_press.html', htmlInclude)
  watch('./src/img/**.jpg', imgToApp)
  watch('./src/img/**.png', imgToApp)
  watch('./src/img/**.jpeg', imgToApp)
  watch('./src/img/**.mp4', imgToApp)
  watch('./src/img/**.webp', imgToApp)
  watch('./src/img/**.svg', svgSprites)
  watch('./src/resources/**', resources)
  watch('./src/fonts/**.ttf', fonts)
  watch('./src/fonts/**.ttf', fontsStyle)
  watch('./src/js/**/*.js', scripts)
}



exports.styles = styles
exports.watchFiles = watchFiles
exports.fileinclude = htmlInclude

exports.default = series(clean, parallel(htmlInclude, scripts, fonts, resources, imgToApp, svgSprites), fontsStyle, styles, watchFiles);


const tinypng = () => {
  return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg', './src/img/**.mp4'])
    .pipe(tiny({
      key: 'hK9qNR8f2tSCY635Kh1MFmBFx2P5dhD6',
    }))
    .pipe(dest('./app/img'))
}

const stylesBuild = () => {
  return src('./src/scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2,
    }))
    .pipe(dest('./app/css/'))
}

const scriptsBuild = () => {
  return src('./src/js/main.js', './src/js/accordion.min.js')
    .pipe(webpackStream({
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }]
      }
    }))
    .pipe(uglify().on("error", notify.onError()))
    .pipe(dest('./app/js'))
}


exports.build = series(clean, parallel(htmlInclude, scriptsBuild, fonts, resources, imgToApp, svgSprites), fontsStyle, stylesBuild, tinypng);
