'use strict';
var fs = require('fs'),
	_ = require('lodash');

/**
 * LogRotator API
 */
var LogRotator = {
	file_name: null,
	file_extension: 'log',
	ttl: '24h'
};

/**
 * Create stream to write logs
 * @param {Object} opts
 * @return {fs.WriteStream}
 */
LogRotator.stream = function (opts) {
	_.extend(this, opts)

	if (this.dirExists()) {
		return fs.createWriteStream(this.directory + '/' + this.getFileName());
	}
};

/**
 * Wrapper around fs.existsSync
 * @return {Boolean}
 */
LogRotator.dirExists = function () {
	if (!this.directory) throw new Error('No target directory is defined');
	return fs.existsSync(this.directory);
};

/**
 * Check to see if the stream is expired and a new one needs to be created
 * @return {Boolean}
 */
LogRotator.hasStreamExpired = function () {
	var now = new Date(normalizeDateStr(getDateStr()));
	var old = new Date(normalizeDateStr(this.last_date_str));

	return now - old >= timeInMs(this.ttl);
};

/**
 * Get the file name to write to
 * @return {String}
 */
LogRotator.getFileName = function () {
	if (!this.last_date_str || this.hasStreamExpired()) {
		this.last_date_str = getDateStr();
	}

	return this.last_date_str + getFileExtension(this.file_extension);
};

function getDateStr() {
	var d = new Date();
	return d.getFullYear() +
		('0' + (d.getMonth() + 1)).substr(-2) +
		('0' + d.getDate()).substr(-2);
}

function normalizeDateStr(date) {
	var year = date.slice(0,4);
	var month = date.slice(4, 6);
	var day = date.slice(6, 8);
	return year + '-' + month + '-' + day;
}

function getFileExtension(ext) {
	if (!ext) {
		return '';
	} else {
		return '.' + ext;
	}
}

/**
 * Get the time in ms
 * @param {String} time - The time as a string.
 * @example timeInMs('24h'); // => 8.64e+7
 * @return {Number}
 */
function timeInMs(time) {
	var HOUR_IN_MS = 3.6e+6,
		DAY_IN_MS = HOUR_IN_MS * 24,
		WK_IN_MS = DAY_IN_MS * 7,
		MS_DICTIONARY = {
			'weeks': WK_IN_MS,
			'week': WK_IN_MS,
			'w': WK_IN_MS,
			'days': DAY_IN_MS,
			'day': DAY_IN_MS,
			'd': DAY_IN_MS,
			'hours': HOUR_IN_MS,
			'hour': HOUR_IN_MS,
			'h': HOUR_IN_MS
		};

	var duration = parseInt(time, 10);
	var interval = time.replace(/\d*[\d]/, '').trim();

	if (Object.keys(MS_DICTIONARY).indexOf(interval) < 0) {
		throw new Error('Interval is invalid. The ttl must be of weeks, days, or hours');
	}

	return MS_DICTIONARY[interval] * duration;
}

module.exports = LogRotator;
