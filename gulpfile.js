var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul');

var _tests = [__dirname + '/tests/**/*.js'],
    _src = [__dirname + '/lib/**/*.js'];

gulp.task('default');

gulp.task('test', function () {
    return gulp.src(_tests)
        .pipe(mocha({
            reporter: 'spec',
            globals: {
                should: require('should')
            }
        }));
});

gulp.task('tdd', function () {
	return gulp.watch([_src, _tests], ['test']);
});

gulp.task('coverage-setup', function () {
    return gulp.src(_src)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task('test:coverage', ['coverage-setup'], function () {
    return gulp.src(_tests)
        .pipe(mocha({
            globals: {
                should: require('should')
            }
        }))
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 85 } }));
});
