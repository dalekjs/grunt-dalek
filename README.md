# grunt-dalek

> Run browser tests with dalak

[![Build Status](https://travis-ci.org/dalekjs/grunt-dalek.png)](https://travis-ci.org/dalekjs/grunt-dalek)
[![Build Status](https://drone.io/github.com/dalekjs/grunt-dalek/status.png)](https://drone.io/github.com/dalekjs/grunt-dalek/latest)
[![Dependency Status](https://david-dm.org/dalekjs/grunt-dalek.png)](https://david-dm.org/dalekjs/grunt-dalek)
[![devDependency Status](https://david-dm.org/dalekjs/grunt-dalek/dev-status.png)](https://david-dm.org/dalekjs/grunt-dalek#info=devDependencies)
[![NPM version](https://badge.fury.io/js/grunt-dalek.png)](http://badge.fury.io/js/grunt-dalek)
[![Coverage](http://dalekjs.com/package/grunt-dalek/master/coverage/coverage.png)](http://dalekjs.com/package/grunt-dalek/master/coverage/index.html)
[![unstable](https://rawgithub.com/hughsk/stability-badges/master/dist/unstable.svg)](http://github.com/hughsk/stability-badges)
[![Stories in Ready](https://badge.waffle.io/dalekjs/grunt-dalek.png?label=ready)](https://waffle.io/dalekjs/grunt-dalek)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/dalekjs/grunt-dalek/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![NPM](https://nodei.co/npm/grunt-dalek.png)](https://nodei.co/npm/grunt-dalek/)
[![NPM](https://nodei.co/npm-dl/grunt-dalek.png)](https://nodei.co/npm/grunt-dalek/)

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-dalek --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-dalek');
```

## The "dalek" task

### Overview
In your project's Gruntfile, add a section named `dalek` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  dalek: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.dalekfile
Type: `Boolean`
Default: `true`

Grunt should load the config options from your Dalekfile

#### options.browser
Type: `Array`
Default: `['phantomjs']`

The browsers you would like to test
Note: For other browsers than PhantomJS, you need to have the Dalek browser plugin installed.

#### options.reporter
Type: `Array`
Default: `null`

The reporters you would like to invoke
Note: For other reporters than the grunt console output, you need to have the corresponding Dalek reporter plugin installed.

#### options.advanced
Type: `Object`
Default: `null`

All the options you else would define in your Dalekfile.
This overwrites the contents of your Dalekfile.

## Examples

### Configuration Example

Basic example of a Grunt config containing the dalek task.
```js
grunt.initConfig({
  dalek: {
    dist: {
      src: ['test/example/test-github.js']
    }
  }

});

/**
 * Loads tasks located in the tasks directory.
 */
grunt.loadTasks('tasks');

grunt.registerTask('default', ['dalek']);
```

### Multiple Files

Running dalekjs against multiple files.
```js
dalek: {
  dist: {
    src: ['test/example/test-dkd.js','test/example/test-github.js']
  }
}
```

### Specifying Options

```js
dalek: {
    options: {
      // invoke phantomjs, chrome & chrome canary
      browser: ['phantomjs', 'chrome', 'chrome:canary'],
      // generate an html & an jUnit report
      reporter: ['html', 'junit'],
      // don't load config from an Dalekfile
      dalekfile: false,
      // specify advanced options (that else would be in your Dalekfile)
      advanced: {
        // specify a port for chrome
        browsers: [{
          chrome: {
            port: 4000
          }
        }]
      }
    }
}
```