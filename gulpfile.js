let gulp =         require('gulp'),
    less =         require('gulp-less'),
    rigger =       require('gulp-rigger'),
    browserSync =  require('browser-sync'),
    sourcemaps =   require('gulp-sourcemaps'),
    notify =       require('gulp-notify'),
    cache =        require('gulp-cache'),
    htmlmin =      require('gulp-htmlmin'),
    autoprefixer = require('gulp-autoprefixer'),
    cssClean =     require('gulp-clean-css'),
    imagemin =     require('gulp-imagemin'),
    pngquant =     require('imagemin-pngquant'),
    del =          require('del'),
    webpack =      require('webpack-stream');

let webConfig = {
    output: {
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
            }
        ]
    },
    mode: 'development',
    
    devtool: 'eval-source-map'
};

let webConfigDist = {
    output: {
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
            }
        ]
    },
    mode: 'production',
    devtool: 'none'
};

gulp.task('less', function() {
    return gulp.src('./src/less/style.less')
        .pipe(sourcemaps.init())
        .pipe(
            less().on('error', notify.onError(
                {
                    sound: false,
                    message: "<%= error.message %>",
                    title  : "less Error!"
                }
            ))
        )
        .pipe(autoprefixer({
            cascade: true,
        }))
        .pipe(sourcemaps.write('./map'))
        .pipe(gulp.dest('./tmp/css'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('html-php', function() {
    return gulp.src(['./src/*.html', './src/*.php'])
        .pipe(rigger())
        .pipe(gulp.dest('./tmp'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
    return gulp.src('./src/js/main.js')
        .pipe(
            webpack(webConfig).on('error', function handleError() {
                this.emit('end');
        }))
        .pipe(gulp.dest('./tmp/js'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('images', function() {
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./tmp/img'))
        .pipe(browserSync.reload({stream: true})) 
});

gulp.task('fonts', function() {
    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./tmp/fonts'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('video', function() {
    return gulp.src('./src/video/**/*')
        .pipe(gulp.dest('./tmp/video'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', async function(){
    browserSync({
        server: {
            baseDir: './tmp',
        },
        notify: true
    });
});

gulp.task('watch', async function() {
    gulp.watch('./src/*.html', gulp.parallel('html-php'));
    gulp.watch('./src/less/**/*.less', gulp.parallel('less'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('scripts'));
    gulp.watch('./src/templates/*.html', gulp.parallel('html-php'));
    gulp.watch('./src/img/**/*', gulp.parallel('images'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts'));
    gulp.watch('./src/video/**/*', gulp.parallel('video'));
});

gulp.task('img', async function() {
	return gulp.src('./src/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			optimizationLevel: 3,
			use: [pngquant()]
		})))
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('prebuild', async function() {
    var distCss = gulp.src('./src/less/style.less')
        .pipe(
            less().on('error', notify.onError(
                {
                    sound: false,
                    message: "<%= error.message %>",
                    title  : "less Error!"
                }
            ))
        )
        .pipe(autoprefixer({
            cascade: true,
        }))
        .pipe(cssClean({
            level: 2,
        }))
        .pipe(gulp.dest('./dist/css'));

    var distScripts = gulp.src('./src/js/main.js')
        .pipe(webpack(webConfigDist))
        .pipe(gulp.dest('./dist/js'))

	var distFonts = gulp.src('./src/fonts/**/*')
	    .pipe(gulp.dest('./dist/fonts'));

	var distVideo = gulp.src('./src/video/**/*')
	    .pipe(gulp.dest('./dist/video'));


    var distHtml = gulp.src('./src/*.html')
        .pipe(rigger())
        .pipe(htmlmin({
            collapseWhitespace: true,
            preserveLineBreaks: true,
            removeComments: true,
        }))
        .pipe(gulp.dest('./dist'));

    var distPhp = gulp.src('./src/*.php')
        .pipe(rigger())
	    .pipe(gulp.dest('./dist'));
});


gulp.task('clear', async function() {
	return cache.clearAll();
});

gulp.task('clean-dist', async function() {
	return del.sync('./dist');
});

gulp.task('clean-dev', async function() {
	return del.sync('./tmp');
});

gulp.task('default', gulp.series('clean-dev', 'less', 'html-php', 'scripts', 'images', 'fonts', 'video', 'browser-sync', 'watch'));

gulp.task('dist', gulp.series('clean-dev', 'prebuild', 'img'));