var gulp = require('gulp'),
    mocha = require('gulp-mocha');

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
