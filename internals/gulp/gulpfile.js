(function changeCurrentWorkingDirectoryToResolveNodeModulesPath() {
  process.chdir('../../');
  console.info('Current working directory %s', process.cwd());
})();

const babel = require('gulp-babel');
const chalk = require('chalk');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const util = require('util');

const babelRc = require('./.babelrc');
const paths = require('../../src/paths');

const buildLog = (tag, ...args) => {
  console.info(chalk.cyan(`[build - ${tag}]`), util.format(...args));
};

const Task = {
  BABEL: 'babel',
  BUILD: 'build',
  CLEAN: 'clean',
};

gulp.task(Task.BABEL, () => {
  buildLog(
    Task.BABEL,
    'NODE_ENV: %s, LIB_PATH: %s, SRC_PATH: %s',
    process.env.NODE_ENV, 
    paths.lib,
    paths.src,
  );

  return gulp.src([`${paths.src}/**/*.{js,jsx,ts,tsx}`])
    .pipe(sourcemaps.init())
    .pipe(babel(babelRc))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.lib));
});

gulp.task(Task.CLEAN, () => {
  buildLog(Task.EMPTYLOG, 'LOG_PATH: %s', paths.logs);

  return del([
    `${paths.lib}/**/*`,
  ]);
});

gulp.task(Task.BUILD, gulp.series(Task.CLEAN, Task.BABEL));
