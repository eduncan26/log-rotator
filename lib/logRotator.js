'use strict';
var fs = require('fs'),
	_ = require('lodash');

/**
 * LogRotator API
 */
var LogRotator = {
	file_name: null,
	file_extension: 'log'
};

/**
 * Create stream to write logs
 * @return {fs.WriteStream}
 */
LogRotator.stream = function () {
	for (var arg in arguments) {
		if (arguments.hasOwnProperty(arg)) {
			arg = arguments[arg]
			if (typeof arg === 'object') {
				_.extend(this, arg);
			}
		}
	}

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

LogRotator.hasStreamExpired = function () {
	var old = new Date(normalizeDateStr(this.last_date_str));
	// If the difference between the original date and now is greater than 86500000 then true
	return new Date() - new Date(normalizeDateStr(this.last_date_str)) > 86400000;
};

LogRotator.getFileName = function () {
	if (!this.last_date_str || this.hasStreamExpired()) {
		this.last_date_str = getYYYYMMDDhhmm();
	}

	return this.last_date_str + getFileExtension(this.file_extension);
};

function parseFileName(name) {
	return name.replace(getFileExtension(this.file_extension), '');
}

function getYYYYMMDDhhmm() {
	var d = new Date();
	return d.getFullYear() + '-' +
		(('0' + d.getMonth() + 1)).substr(1) + '-' +
		(('0' + d.getDate()).substr(1)) + '-' +
		(('0' + d.getHours()).substr(1)) + ':' +
		(('0' + d.getMinutes()).substr(1));
}

function normalizeDateStr(date) {
	return date.split('-');
}

function getFileExtension(ext) {
	if (!ext) {
		return '';
	} else {
		return '.' + ext;
	}
}

module.exports = LogRotator;
