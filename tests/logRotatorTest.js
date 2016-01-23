'use strict';
var path = require('path');
var LogRotator = require(path.join(__dirname, '..', 'lib/logRotator')); 
var fs = require('fs');
var moment = require('moment');

var testDir = path.join(__dirname, '..', '/.tmp');

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
		LogRotator.file_extension = '.log';
	});

	context('#stream()', function () {
		it('should return an error if an output directory is not provided', function () {
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
			LogRotator.directory = testDir;
			LogRotator.stream().should.be.instanceOf(fs.WriteStream)
		});

		it('should return undefined if the target directory does not exist', function () {
			LogRotator.directory = '/some/dir';
			(LogRotator.stream() === undefined).should.be.true();
		});

		it('should not have an extension if file_extension null', function () {
			LogRotator.file_extension = null;
			LogRotator.directory = testDir;
			LogRotator.stream().path.should.equal(testDir + '/' + LogRotator.last_date_str);
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
		it('should return true if the dates are over 24 hours apart', function () {
			LogRotator.last_date_str = '2015-01-01-01:01';
			LogRotator.hasStreamExpired().should.be.true();
		});

		it('should return false if the dates are less that 24 hours apart', function () {
			LogRotator.last_date_str = moment().format('YYYY-MM-DD-hh:mm');
			LogRotator.hasStreamExpired().should.be.false();
		});
	});

	context('#getFileName()', function () {
		var tests = [
			{ flow: null, name: 'null' },
			{ flow: '2015-01-01-01:01', name: 'expired' },
			{ flow: moment().format('YYYY-MM-DD-hh:mm'), name: 'current' }
		];

		tests.forEach(function (test) {
			it('should return a file name when last_date_str is ' + test.name, function () {
				LogRotator.last_date_str = test.flow;
				LogRotator.getFileName().should.be.ok();
			});
		});
	});
});
 