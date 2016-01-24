'use strict';
var path = require('path');
var LogRotator = require(path.join(__dirname, '..', 'lib/logRotator')); 
var fs = require('fs');
var moment = require('moment');

var testDir = path.join(__dirname, '..', '/.tmp');
var dateFmt = 'YYYYMMDD';

describe('Log Rotator', function () {
	before(function (done) {
		fs.mkdir(testDir, function (err) {
			if (err && err.code !== 'EEXIST') {
				console.log('Something went wrong!!!');
				console.error(err);
				process.exit(1);
			}
			done();
		});
	});

	afterEach(function () {
		LogRotator.directory = null;
		LogRotator.expires = null;
		LogRotator.file_extension = 'log';
	});

	context('#stream()', function () {
		beforeEach(function () {
			LogRotator.directory = testDir
		});

		it('should return an error if an output directory is not provided', function () {
			LogRotator.directory = null;
			LogRotator.stream.should.throw();
			try {
				LogRotator.stream();
				(true).should.be.false();
			} catch (err) {
				err.message.should.equal('No target directory is defined');
			}
		});

		it('should extend optional arguments', function () {
			LogRotator.stream({ foo: 'bar', directory: testDir, expires: '24h'});
			LogRotator.foo.should.equal('bar');
		});

		it('should not return an error if a directory is set', function () {
			LogRotator.stream().should.be.instanceOf(fs.WriteStream)
		});

		it('should return undefined if the target directory does not exist', function () {
			LogRotator.directory = '/some/dir';
			(LogRotator.stream() === undefined).should.be.true();
		});

		it('should not have an extension if file_extension null', function () {
			LogRotator.file_extension = null;
			LogRotator.stream().path.should.equal(testDir + '/' + LogRotator.last_date_str);
		});

		it('should not create a new file every time it is invoked', function () {
			var s1 = LogRotator.stream();
			var s2 = LogRotator.stream();
			s1.path.should.equal(s2.path);
		});

		it('should throw an error if the ttl is not recognized', function () {
			LogRotator.ttl = '30 seconds';

			try {
				LogRotator.stream();
				(true).should.be.false();
			} catch (err) {
				err.message.should.equal('Interval is invalid. The ttl must be of weeks, days, or hours');
				// Reset
				LogRotator.ttl = '24h';
			}
		});
	});

	context('#dirExists()', function () {
		it('should throw an error if this.directory is not defined', function () {
			LogRotator.dirExists.should.throw();

			try {
				LogRotator.dirExists();
				(true).should.be.false();
			} catch (err) {
				err.message.should.equal('No target directory is defined');
			}
		});

		it('should return true if the directory exists', function () {
			LogRotator.directory = testDir;
			LogRotator.dirExists().should.be.true();
		});

		it('should return false if the directory does not exist', function () {
			LogRotator.directory = '/crazy/dir/name';
			LogRotator.dirExists().should.be.false();
		});
	});

	context('#hasStreamExpired()', function () {
		var tests = [
			{ assertion: true, duration: '24h', gt_lt: 'gt', date: moment().subtract(24, 'hours').format(dateFmt) },
			{ assertion: true, duration: '7 days', gt_lt: 'gt', date: moment().subtract(7, 'days').format(dateFmt) },
			{ assertion: true, duration: '1week', gt_lt: 'gt', date: moment().subtract(1, 'week').format(dateFmt) },
			{ assertion: false, duration: '24h', gt_lt: 'lt', date: moment().format(dateFmt) },
			{ assertion: false, duration: '7 days', gt_lt: 'lt', date: moment().format(dateFmt) },
			{ assertion: false, duration: '1week', gt_lt: 'lt', date: moment().format(dateFmt) }
		];

		tests.forEach(function (test) {
			it('should return ' + test.assertion + ' if the dates are ' + test.gt_lt + ' ' + test.duration + ' apart', function () {
				LogRotator.last_date_str = test.date;
				LogRotator.hasStreamExpired().should.be[test.assertion]();
			});
		});
	});

	context('#getFileName()', function () {
		var tests = [
			{ flow: null, name: 'null' },
			{ flow: '20150101', name: 'expired' },
			{ flow: moment().format(dateFmt), name: 'current' }
		];

		tests.forEach(function (test) {
			it('should return a file name when last_date_str is ' + test.name, function () {
				LogRotator.last_date_str = test.flow;
				LogRotator.getFileName().should.be.ok();
			});
		});
	});
});
 