'use strict';

var gulp = require('gulp');
var wrench = require('wrench');

gulp.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  appPath: 'src/',
  appStructFile: 'construct.json',
  templatePath: 'app_templates/'
};
gulp.appName = 'BigScreen';

require('require-dir')('./gulp');

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});

gulp.task('default', ['clean'], function () {
    // gulp.start('build');
    gulp.start('serve');
});
