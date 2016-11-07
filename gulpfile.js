var gulp = require("gulp");
var uglify = require('gulp-uglify'); // 用于压缩 JS
var minifycss = require('gulp-clean-css'); 
var concat = require('gulp-concat');
var rjs = require('requirejs'); // requirejs合并压缩插件
var del = require('del'); //删除文件插件
var runSequence = require('run-sequence');// gulp任务顺序执行插件
var header = require('gulp.header');

var baseJS = ["jquery.js", "underscore.js", "require.js", "backbone.js", "jquery.underscore.plugin.js"]
            .map(function(item) {
                return 'code/common/' + item;
            }),
    headerTemp=['/**',
        ' * {{ pkg.name }} - {{ pkg.description }}',
        ' * @authors    {{ pkg.author }}',
        ' * @date       {{ pkg.date }}',
        ' * @email      {{ pkg.email }}',
        ' * @version    v{{ pkg.version }}',
        ' * @license    {{ pkg.license }}',
        ' */',
        ''
    ].join('\n'),
    headerData=require('./package.json');
    headerData.date=new Date();

// 合并压缩公共js
gulp.task("minBasejs",function(){
   return gulp.src(baseJS)
        .pipe(uglify())
        .pipe(concat("tempBase.js"))
        .pipe(gulp.dest("code/_tempBuild/")); //输出目录
});
// 合并压缩组件js
gulp.task("minComponentjs",function(){
   return gulp.src('code/components/*.js')
        .pipe(uglify())
        .pipe(concat("tempComponents.js"))
        .pipe(gulp.dest("code/_tempBuild/")); //输出目录
});
// 合并压缩API js
// r.js
gulp.task("minApijs",function(){
    var componentsPaths = {
        "text": "common/require.text",
        "cPageView": "api/c.page.view"
    },
    componentsInclude = ["cPageView","text"];

     var rjsOptions = {
        appDir: "code",
        baseUrl: "./",
        dir: "code/_tempBuild",
        optimize: "uglify2",
        skipModuleInsertion: true,
        removeCombined: true,
        preserveLicenseComments:false,//不要头部备注
        uglify2: {
            mangle: {
                except: ['$super'] //$super关键字不压缩替换
            }
        },
        paths: componentsPaths,
        modules: [{
            create: true,
            name: "tempApi",
            include: componentsInclude
        }],
        fileExclusionRegExp: /^(\.|build|min)/
    };
    return rjs.optimize(rjsOptions, function(buildResponse) {
      cb();
    }, function(err) {
       console.log(err);
    })
});

// 公共方法合并后再与组件/API压缩文件合并
gulp.task('concatJS', function() {
    return gulp.src(["code/_tempBuild/tempBase.js", "code/_tempBuild/tempComponents.js", "code/_tempBuild/tempApi.js"]) //路劲
        .pipe(concat("Turtle.min.js")) //合并后的文件名
        .pipe(header(headerTemp,{pkg:headerData})) //从package.json中获取信息，加到压缩后文件开头
        .pipe(gulp.dest("code/build/")); //输出目录
});

// 删除无用的临时文件
gulp.task("cleanFile",function(){
    return del(["code/_tempBuild/**"]);
});

// 压缩css
gulp.task('minCss',function(){
    gulp.src('code/components/css/*.css')
    .pipe(concat('Turtle.min.css'))
    .pipe(minifycss())
    .pipe(header(headerTemp,{pkg:headerData}))
    .pipe(gulp.dest('code/build/css/'));
});

gulp.task("build",function(cb){
    runSequence(['minBasejs','minComponentjs', 'minApijs'],'concatJS','minCss','cleanFile',cb);
});


