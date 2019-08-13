const gulp = require('gulp');
const util = require('gulp-util');
const concat = require('gulp-concat')
const rename = require('gulp-rename');
const gulpIf = require('gulp-if');
const del = require('del')
const uglify = require('gulp-uglify-es').default;

// Errors
const plumber = require('gulp-plumber');
const notify = require('gulp-notify')

// Images
const imagemin = require('gulp-imagemin');

// Nunjucks
const nunjucksRender = require('gulp-nunjucks-render');
const prettify = require('gulp-prettify');
const frontMatter = require('gulp-front-matter');
const htmlmin = require('gulp-htmlmin');

// Styles
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');

// SVG
const svgmin = require('gulp-svgmin');
const svgStore = require('gulp-svgstore');
const cheerio = require('cheerio');
const gulpcheerio = require('gulp-cheerio');
const through2 = require('through2');
const consolidate = require('gulp-consolidate');

var path = require('path');
var fs = require('fs');

// Server
const server = require('browser-sync').create();


// List pages
const requireYaml = require('require-yaml');

// Deploy
const ftp = require('vinyl-ftp');

// Webpack
const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;
const named = require('vinyl-named');
const gulplog = require('gulplog');
const terser = require('gulp-terser');


// Config

const setmodeProd = done => {
  config.setEnv('production');
  config.logEnv();
  done();
}

const setmodeDev = done => {
  config.setEnv('development');
  config.logEnv();
  done();
}

const production = util.env.production || util.env.prod || util.env._.indexOf('build') !== -1 || false;
const destPath = 'build';

const config = {
  env: 'development',
  production: production,


  src: {
    root: 'src',
    templates: 'src/templates',
    templatesData: 'src/templates/data',
    pagelist     : 'src/templates/index.yaml',
    styles: 'src/styles',
    // path for sass files that will be generated automatically via some of tasks
    sassGen: 'src/styles/generated',
    js: 'src/js',
    php: 'src/php',
    images: 'src/assets/images',
    svg: 'src/img/svg',
    icons: 'src/icons',
    // path to png sources for sprite:png task
    iconsPng: 'src/icons',
    // path to svg sources for sprite:svg task
    iconsSvg: 'src/icons',
    // path to svg sources for iconfont task
    iconsFont: 'src/icons',
    symbolSprite: 'src/assets/sprites/svg-symbol',
    fonts: 'src/assets/fonts',
    lib: 'src/lib',
    data: 'src/data',
    static: 'src/assets/static',
    assets: 'src/assets'
  },
  dest: {
    root: destPath,
    html: destPath,
    css: destPath + '/css',
    js: destPath + '/js',
    php: destPath + '/php',
    images: destPath + '/assets/images',
    fonts: destPath + '/assets/fonts',
    lib: destPath + '/lib',
    data: destPath + '/data',
    static: destPath + '/static'
  },
  setEnv: function (env) {
    if (typeof env !== 'string') return;
    this.env = env;
    this.production = env === 'production';
    process.env.NODE_ENV = env;
  },

  logEnv: function () {
    util.log(
      'Environment:',
      util.colors.white.bgRed(' ' + process.env.NODE_ENV + ' ')
    );
  },
}

config.setEnv(production ? 'production' : 'development');

// function lazyRequireTask(taskName, path, options) {
//     options = options || {};
//     options.taskName = taskName;
//     gulp.task(taskName, function(callback) {
//       let task = require(path).call(this, options);

//       return task(callback);
//     });
//   }

// lazyRequireTask('styles', '.tasks/styles', {
//   src: 'src/styles'
// })


// clean
gulp.task('clean', function () {
  return del([
    config.dest.root
  ]);

})

// copy
gulp.task('copy:images', () => gulp
  .src(config.src.images + '/**/*.{jpg,png,jpeg,svg,gif}')
  .pipe(gulp.dest(config.dest.images))
);

gulp.task('copy:fonts', () => gulp
  .src(config.src.fonts + '/**/*.{ttf,eot,woff,woff2}')
  .pipe(gulp.dest(config.dest.fonts))
);

gulp.task('copy:static', () => gulp
  .src(config.src.static + '/*.{ico,txt,xml')
  .pipe(gulp.dest(config.dest.static))
);

gulp.task('copy:php', () => gulp
  .src(config.src.php + '/**/*.*')
  .pipe(gulp.dest(config.dest.php))
);



gulp.task('copy', gulp.series('copy:images', 'copy:fonts', 'copy:static', 'copy:php'));


// deploy

gulp.task('deploy', function () {

  var conn = ftp.create({
    host: 'frontend-tech.ru',
    user: 'aeolia40_alex',
    password: 'xerhbq240655',
    parallel: 10,
    log: util.log
  });

  var globs = [
    'build/**'
  ];

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  return gulp.src(globs, { base: './build/', buffer: false })
    .pipe(conn.newer('')) // only upload newer files
    .pipe(conn.dest(''));

});

// nunjucks
gulp.task('nunjucks', function () {

  nunjucksRender.nunjucks.configure({
    watch: false,
    trimBlocks: true,
    lstripBlocks: false
  });


  return gulp.src([config.src.templates + '/**/[^_]*.html'])
    .pipe(frontMatter({ property: 'data' }))
    .pipe(nunjucksRender({
      PRODUCTION: config.production,
      path: [config.src.templates]
    }
    ))
    .pipe(gulpIf(!config.production, prettify({
      indent_size: 2,
      wrap_attributes: 'auto', // 'force'
      preserve_newlines: false,
      // unformatted: [],
      end_with_newline: true
    })))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(config.dest.html))
})

// sass

gulp.task('styles', function () {

  const processors = [
    autoprefixer({
      cascade: false
    }),
    // require('lost'),
    // mqpacker({
    //   sort: sortMediaQueries
    // }),
    csso
  ];

  return gulp.src(config.src.styles + '/*.{sass,scss}')
    .pipe(gulpIf(!production, sourcemaps.init()))
    .pipe(sass({
      outputStyle: config.production ? 'compact' : 'expanded', // nested, expanded, compact, compressed
      precision: 5
    }))
    .pipe(postcss(processors))
    .pipe(gulpIf(!production, sourcemaps.write('./')))
    .pipe(gulp.dest(config.dest.css))
})



function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function (file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

gulp.task('symbol:svg', function (done) {

  var folders = getFolders(config.src.symbolSprite);

  var tasks = folders.map(function (folder) {
    return gulp.src(path.join(config.src.symbolSprite, folder, '*.svg'))
      .pipe(
        gulpcheerio({
          run: function ($, file) {
            if ($('svg').attr('height')) {

            }else {
              $('[fill]').removeAttr('fill');
              $('[stroke]').removeAttr('stroke');
              $('[style]').removeAttr('style');
            }
          },
          parserOptions: { xmlMode: true }
        })
      )
      .pipe(svgmin({
        js2svg: {
          pretty: true
        },
        plugins: [{
          removeDesc: true
        }, {
          cleanupIDs: true
        }, {
          removeViewBox: false
        }, {
          mergePaths: false
        }]
      }))
      .pipe(rename({ prefix: 'icon-' }))
      .pipe(svgStore({ inlineSvg: false }))
      .pipe(through2.obj(function (file, encoding, cb) {
        let $ = cheerio.load(file.contents.toString(), { xmlMode: true });
        let data = $('svg > symbol').map(function () {
          let $this = $(this);
          let size = $this.attr('viewBox').split(' ').splice(2);
          let name = $this.attr('id');
          let ratio = size[0] / size[1]; // symbol width / symbol height
          let fontSize = size[1] / 16;

          return {
            name: name,
            ratio: +ratio.toFixed(2),
            fontSize: fontSize.toFixed(1)
          };
        }).get();
        this.push(file);
        gulp.src('gulp/sprite-svg/_sprite-svg-symbol.scss')
          .pipe(consolidate('lodash', {
            symbols: data
          }))
          .pipe(gulp.dest(config.src.sassGen + '/' + folder))
          ;
        cb();
      }))

      .pipe(rename({ basename: 'sprite-symbol-' + folder }))
      .pipe(gulp.dest(config.dest.images + '/' + folder))
  });

  done();
});

// sprite-svg

// sprite-image


// server
gulp.task('server', function(done) {
  server.init({
    server: {
      baseDir: !config.production ? [config.dest.root, config.src.root] : config.dest.root,
      directory: false,
      serveStaticOptions: {
        extensions: ['html']
      }
    },
    files: [
      config.dest.html + '/*.html',
      config.dest.css + '/*.css',
      config.dest.img + '/**/*'
    ],
    port: util.env.port || 8080,
    logLevel: 'info', // 'debug', 'info', 'silent', 'warn'
    logConnections: false,
    logFileChanges: true,
    open: Boolean(util.env.open),
    notify: false,
    ghostMode: false,
    online: Boolean(util.env.tunnel),
    tunnel: util.env.tunnel || null
  });
  done();
})

// Webpack



gulp.task('webpack', function(callback) {
  // return gulp.src(config.src.js + '/*.js')
  // .pipe(gulp.dest(config.dest.js))
  let firstBuildReady = false;

  function done(err, stats) {
    firstBuildReady = true;

    if (err) { // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
      return;  // emit('error', err) in webpack-stream
    }

    gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
      colors: true
    }));

  }


   
  const options = {
    output: {
      publicPath: '/js',
      filename: !production ? '[name].js' : '[name].[hash].js'
    },
      module: {
        rules: [{
        test:    /\.js$/,
        exclude: '/node_modules/',
        loader: 'babel-loader'
      }]
    },
    mode: !production ? 'development' : 'production',
    devtool: !production ? 'cheap-module-inline-soucre-map' : 'source-map',
    watch: !production,
    plugins: [
      new webpack.NoEmitOnErrorsPlugin()
    ]
  };

  if (production) {
    const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
  
    options.plugins.push(new UglifyJSPlugin());
  }

  return gulp.src(config.src.js + '/*.js')
.pipe(plumber({
  errorHandler: notify.onError(err => ({
    title: 'Webpack',
    message: err.message
  }))
}))
.pipe(named())
.pipe(webpackStream(options, null, done))
.pipe(gulp.dest(config.dest.js))
.on('data', function() {
  if (firstBuildReady) {
    callback();
  }
});
})

// List Of Pages

gulp.task('list-pages', function() {
  delete require.cache[require.resolve(__dirname + '/'  + config.src.pagelist)]
    const pages = require(__dirname + '/' + config.src.pagelist);
    return gulp
      .src(__dirname + '/gulp/list-pages/index.html')
      .pipe(consolidate('lodash', {
        pages: pages
      }))
      .pipe(gulp.dest(config.dest.html));
});

// const build = gulp => gulp.parallel('list-pages');
// const watch = gulp => () => gulp.watch(config.src.root+'/*', gulp.series('list-pages'));

// Watch
gulp.task('watch', function() {
  gulp.watch(config.src.styles + '/**/*.{sass,scss}', gulp.parallel('styles'));   // styles
  gulp.watch(config.src.assets + '/**', gulp.parallel('copy'));  // copy
  gulp.watch(config.src.symbolSprite + '/**/*.svg', gulp.parallel('symbol:svg'));     // svg:symbol
  gulp.watch([config.src.templates + '/**/*.html'], gulp.parallel('nunjucks'));  //nunjucks
  // gulp.watch(config.src.js + '/*.js', gulp.parallel('webpack'));  //webpack
  gulp.watch(config.src.root+'/*', gulp.series('list-pages')) //list-pages
})


gulp.task(
  'build',
  gulp.series(
    setmodeProd,
    'clean',
    'symbol:svg',
    'styles',
    'nunjucks',
    'copy',
    'webpack',
  )
);

gulp.task(
  'build:dev',
  gulp.series(
    setmodeDev,
    'clean',
    'symbol:svg',
    'styles',
    'nunjucks',
    'copy',
    'webpack',
    'list-pages'
  )
);



gulp.task('default', gulp.series(['build:dev', 'server', 'watch']));