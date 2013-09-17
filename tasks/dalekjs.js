/*!
 *
 * Copyright (c) 2013 Peter Foerger & Sebastian Golasch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/**
 * Run browser tests with dalak
 * 
 * ## Getting Started
 * This plugin requires Grunt `~0.4.1`
 * 
 * If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:
 * 
 * ```bash
 * npm install grunt-dalek --save-dev
 * ```
 * 
 * Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:
 * 
 * ```javascript
 * grunt.loadNpmTasks('grunt-dalek');
 * ```
 * 
 * ## The "dalek" task
 * 
 * ### Overview
 * In your project's Gruntfile, add a section named `dalek` to the data object passed into `grunt.initConfig()`.
 * 
 * ```javascript
 * grunt.initConfig({
 *   dalek: {
 *     options: {
 *       // Task-specific options go here.
 *     },
 *     your_target: {
 *       // Target-specific file lists and/or options go here.
 *     },
 *   },
 * })
 * ```
 * 
 * ### Options
 * 
 * #### options.dalekfile
 * Type: `Boolean`
 * Default: `true`
 * 
 * Grunt should load the config options from your Dalekfile
 * 
 * #### options.browser
 * Type: `Array`
 * Default: `['phantomjs']`
 * 
 * The browsers you would like to test
 * Note: For other browsers than PhantomJS, you need to have the Dalek browser plugin installed.
 * 
 * #### options.reporter
 * Type: `Array`
 * Default: `null`
 * 
 * The reporters you would like to invoke
 * Note: For other reporters than the grunt console output, you need to have the corresponding Dalek reporter plugin installed.
 * 
 * #### options.advanced
 * Type: `Object`
 * Default: `null`
 * 
 * All the options you else would define in your Dalekfile.
 * This overwrites the contents of your Dalekfile.
 * 
 * ## Examples
 * 
 * ### Configuration Example
 * 
 * Basic example of a Grunt config containing the dalek task.
 * 
 * ```javascript
 * grunt.initConfig({
 *   dalek: {
 *     dist: {
 *       src: ['test/example/test-github.js']
 *     }
 *   }
 * 
 * });
 * 
 * // Loads tasks located in the tasks directory. 
 * grunt.loadTasks('tasks');
 * 
 * grunt.registerTask('default', ['dalek']);
 * ```
 * 
 * ### Multiple Files
 * 
 * Running dalekjs against multiple files.
 * 
 * ```javascript
 * dalek: {
 *   dist: {
 *     src: ['test/example/test-dkd.js','test/example/test-github.js']
 *   }
 * }
 * ```
 * 
 * ### Specifying Options
 * 
 * ```javascript
 * dalek: {
 *     options: {
 *       // invoke phantomjs, chrome & chrome canary
 *       browser: ['phantomjs', 'chrome', 'chrome:canary'],
 *       // generate an html & an jUnit report
 *       reporter: ['html', 'junit'],
 *       // don't load config from an Dalekfile
 *       dalekfile: false,
 *       // specify advanced options (that else would be in your Dalekfile)
 *       advanced: {
 *         // specify a port for chrome
 *         browsers: [{
 *           chrome: {
 *             port: 4000
 *           }
 *         }]
 *       }
 *     }
 * }
 * ```
 *
 * @part Grunt
 * @api
 */

module.exports = function(grunt) {
  'use strict';

  grunt.registerMultiTask('dalek', 'dalekjs browser tests', function () {
    // tagging this task as async
    var done = this.async();

    // load dalek
    var Dalek = require('dalekjs');

    // yeah, globals, but stored for a good reason
    var currentTest;
    var currentBrowser;
    var failedAssertions = [];

    // setting defaults for user set options
    var options = this.options();
    var driver = [];
    var reporter = [];
    var browser = [];

    // setting defaults for advanced & plugin options
    var loadDalekfile = true;
    var advanced = {};

    // check if options are available,
    // else use daleks defaults
    if (options) {
      driver = options.driver && Array.isArray(options.driver) ? options.driver : driver;
      reporter = options.reporter && Array.isArray(options.reporter) ? options.reporter : reporter;
      browser = options.browser && Array.isArray(options.browser) ? options.browser : browser;
    }

    // check if advanced options are available
    if (options) {
      loadDalekfile = (options.dalekfile || options.dalekfile === false) ? options.dalekfile : loadDalekfile;
      if (options.advanced && typeof options.advanced === 'object') {
        advanced = options.advanced;
      }

      advanced.dalekfile = loadDalekfile;
    }

    // instanciate dalek with obligatory options
    var dalek = new Dalek({
      tests: this.filesSrc,
      driver: driver,
      reporter: reporter,
      browser: browser,
      logLevel: -1,
      noColors: true,
      noSymbols: true,
      advanced: advanced
    });

    // grunt logging
    // -------------

    // If options.force then log an error, otherwise exit with a warning
    var warnUnlessForced = function (message) {
      if (options && options.force) {
        grunt.log.error(message);
      } else {
        grunt.warn(message);
      }
    };

    // Log failed assertions
    var logFailedAssertions = function() {
      var assertion;
      // Print each assertion error.
      while (assertion = failedAssertions.shift()) {
        grunt.verbose.or.error(assertion.testName);
        grunt.log.error('Message: ' + formatMessage(assertion.message));
        if (assertion.actual !== assertion.expected) {
          grunt.log.error('Actual: ' + formatMessage(assertion.actual));
          grunt.log.error('Expected: ' + formatMessage(assertion.expected));
        }
        if (assertion.source) {
          grunt.log.error('Source:' + formatMessage(assertion.source.replace(/ {4}(at)/g, '  $1')));
        }
        grunt.log.error('Browser: ' + formatMessage(assertion.browserName));
        grunt.log.writeln();
      }
    };

    // Allow an error message to retain its color when split across multiple lines.
    var formatMessage = function(str) {
      return String(str).split('\n').map(function(s) { return s.magenta; }).join('\n');
    };

    // register browser launcher event
    dalek.reporterEvents.on('report:run:browser', function(browserName) {
      currentBrowser = browserName;
    });

    // register logging for runner finished
    dalek.reporterEvents.on('report:runner:finished', function(data) {
      var message = '';
      // Print assertion errors here, if verbose mode is disabled.
      if (!data.status) {
        message = data.assertionsPassed + '/' + data.assertions + ' assertions passed (';
        message += data.elapsedTime.hours ? data.elapsedTime.hours + ' hours' : '';
        message += data.elapsedTime.minutes ? data.elapsedTime.minutes + ' min' : '';
        message += data.elapsedTime.seconds ? Math.round(data.elapsedTime.seconds * Math.pow(10, 2)) / Math.pow(10, 2) + ' sec' : '';
        message += ')';
        
        if (!grunt.option('verbose')) {
          grunt.log.writeln();
          logFailedAssertions();
        }

        grunt.log.writeln();
        warnUnlessForced(message);

        setTimeout(function () {
          done(false);
        }, 250);
      } else if (data.assertions === 0) {
        // create 0 assertions message
        message = '0/0 assertions ran (';
        message += data.elapsedTime.hours ? data.elapsedTime.hours + ' hours' : '';
        message += data.elapsedTime.minutes ? data.elapsedTime.minutes + ' min' : '';
        message += data.elapsedTime.seconds ? Math.round(data.elapsedTime.seconds * Math.pow(10, 2)) / Math.pow(10, 2) + ' sec' : '';
        message += ')';

        // timeout hack to enable shutdown of 3rd party processes
        setTimeout(function () {
          warnUnlessForced(message);
          done(false);
        }, 250);
      } else {
        // create passed assertions message
        message = data.assertions + '/' + data.assertions + ' assertions passed (';
        message += data.elapsedTime.hours ? data.elapsedTime.hours + ' hours' : '';
        message += data.elapsedTime.minutes ? data.elapsedTime.minutes + ' min' : '';
        message += data.elapsedTime.seconds ? Math.round(data.elapsedTime.seconds * Math.pow(10, 2)) / Math.pow(10, 2) + ' sec' : '';
        message += ')';

        setTimeout(function () {
          grunt.log.writeln('');
          grunt.log.ok(message);
          done(true);
        }, 250);
      }
    });

    // log assertion
    dalek.reporterEvents.on('report:assertion', function(data) {
      if (!data.success) {
        failedAssertions.push({
          actual: data.value,
          expected: data.expected,
          message: (data.message || 'No message'),
          source: data.type,
          testName: currentTest,
          browserName: currentBrowser
        });
      }
    });

    // log test started
    dalek.reporterEvents.on('report:test:started', function(data) {
      currentTest = data.name;
      grunt.verbose.write(currentTest + '...');
    });

    // log test finished
    dalek.reporterEvents.on('report:test:finished', function(data) {
      // Log errors if necessary, otherwise success.
      if (!data.status) {
        // list assertions
        if (grunt.option('verbose')) {
          grunt.log.error();
          logFailedAssertions();
        } else {
          grunt.log.write('F'.red);
        }
      } else {
        grunt.verbose.ok().or.write('.');
      }
    });

    // All tests have been run.

    // log error
    dalek.reporterEvents.on('error', function(message) {
      setTimeout(function () {
        if (options && options.force) {
          grunt.log.error(message);
        } else {
          grunt.warn(message);
        }

        done(false);
      }, 250);
    });

    // log warning
    dalek.reporterEvents.on('warning', function(message) {
      grunt.log.write('>> Warning: '.yellow + message + '\n');
    });

    // Re-broadcast dalek events on grunt.event.
    dalek.reporterEvents.onAny(function() {
      var args = [this.event].concat(grunt.util.toArray(arguments));
      args[0] = 'dalek:' + args[0];
      grunt.event.emit.apply(grunt.event, args);
    });

    // start dalek
    dalek.run();
  });
};