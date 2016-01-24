# log-rotator [![Build Status](https://travis-ci.org/eduncan26/log-rotator.svg?branch=master)](https://travis-ci.org/eduncan26/log-rotator)


## Getting Started

Install log-rotator with npm.

```
npm install log-rotator
```

Include it in your project

```javascript

var logRotator = require('log-rotator');

logRotator.stream({ directory: './foo' });

``` 

## Using with Express and Morgan
```javascript
var app = require('express')(),
    morgan = require('morgan'),
    logRotator = require('log-rotator');


var logStream = logRotator.stream({
	directory: './foo',
	ttl: '1d',
	file_extension: 'log'
});

app.use(morgan('combined', { stream: logStream }));
```

## Options

The log-rotator API allows you to override all of the defaults to configure it the way that you want.

Options can be passed to the stream function or set on the logRotator directly

```javascript

logRotator.directory = './foo';
logRotator.stream();

// Above is the same as

logRotator.stream({ directory: './foo' });
```

### LogRotator.directory -- required
Set the target directory.

```javascript
logRotator.directory = './foo/bar';
```

### LogRotator.file_name
Set the default file_name. Defaults to null

```javascript
// write files to foo20160101.log
logRotator.file_name = 'foo';
``` 

### LogRotator.file_extension
Set the default file_extension. Defaults to 'log'

```javascript
// write files to 20160101.node_log
logRotator.file_extension = 'node_log';
```

### LogRotator.ttl
Set the default time to live. Defaults to 24h.

Possible intervals are weeks (w), days (d), hours (h). Interval supports both the plural and singular nouns as well as the abbreviated version.

```javascript
logRotator.ttl = '1w';
logRotator.ttl = '30 days';
logRotator.ttl = '24hours';

// Also works as singular
logRotator.ttl = '1 week';
logRotator.ttl = '1 day';
logRotator.ttl = '1 hour';
```

## Releases

See [CHANGELOG](https://github.com/eduncan26/log-rotator/blob/master/CHANGELOG)

## License

MIT &copy; 2016 Evan Duncan
