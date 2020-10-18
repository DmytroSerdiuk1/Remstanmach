"use strict"
const {
  src,
  dest,
  series,
  watch
} = require('gulp');
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()
const gulpWebpack = require('webpack-stream')
const imagemin = require('gulp-imagemin')
const fs = require('fs');

function html() {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'))
}

function webpacks() {
  return src('src/js/main.js')
    .pipe(gulpWebpack({
      mode: 'production',
      output: {
        filename: '[name].js',
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          },
        ]
      }
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end'); // Don't stop the rest of the task
    })
    .pipe(dest('dist/js'))
    .pipe(sync.stream());
}

function fonts(){
  return src('./src/font/**.ttf')
    .pipe(dest('./dist/font/'));
}


function scss() {
  return src('src/scss/**.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(concat('style.css'))
    .pipe(dest('dist/style'))
}


function minifyImg(){
  return src('src/img/*')
  .pipe(imagemin())
  .pipe(dest('dist/img'))
}

function clear() {
  return del('dist')
}

const cb =()=>{};

const srcPage = './src/html/',
srcSCSS = './src/scss/components';

function createComponent(){
    fs.readdir(srcPage, '', function(err, item){
      if(item){
        item.forEach(el => {
          let componentName = el.split('.');
          componentName = componentName[0];
            fs.appendFile(`${srcSCSS}/_${componentName}.scss`, '', (err) => {
            if (err) throw err;
          });
        });
        console.log(`Append component`);
      }
  
      if(err){
        console.error(err);
        return
      }
    })
}

async function sdd(){
  fs.readdir(srcSCSS,'', (err, item)=>{
    fs.writeFile('./src/scss/_component.scss', '', cb)
    if(item){
      console.log("Clering");
      let bName;
      item.forEach(el => {
        let componentName = el.split('.');
          componentName = componentName[0].replace(/\_/g, '');
          if(componentName != bName){
            fs.appendFile('./src/scss/_component.scss', `@import './components/${componentName}';\r\n`, cb);
          }
          bName = componentName;
      });
      console.log("Write components");
    }
  })
}

async function constructor(){
  return new Promise(async r => {
    createComponent()
    r()
  }).then(sdd)
}

function serve() {
  sync.init({
    server: './dist'
  })

  watch('src/**.html', series(html)).on('change', sync.reload)
  watch('src/html/**.html', series(html)).on('change', sync.reload)
  watch('./src/font/**', fonts);
  watch('./src/js/**/*.js', webpacks);
  watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
  watch('src/scss/components/**.scss', series(scss)).on('change', sync.reload)
  watch('src/img/**', series(minifyImg))
}


exports.compBuild= series(constructor)
exports.default = series(clear, webpacks, fonts, scss, html, minifyImg, serve)
exports.clear = clear