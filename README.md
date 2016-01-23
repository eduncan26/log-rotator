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


var logStream = logRotator.stream({ directory: './foo' });

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
// write files to foo2016-01-01-15:15.log
logRotator.file_name = 'foo';
``` 

### LogRotator.file_extension
Set the default file_extension. Defaults to 'log'

```javascript
// write files to 2016-01-01-15:15.node_log
logRotator.file_extension = 'node_log';
```

## Releases

See [CHANGELOG](https://github.com/eduncan26/log-rotator/blob/master/CHANGELOG)

## License

MIT &copy; 2016 Evan Duncan
