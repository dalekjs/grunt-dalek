/*
 * grunt-dalekjs
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('dalek', 'dalekjs browser tests', function() {

    var glob = require('glob');

    /**
     * Asynchronously loops through the provided files and puts them through the
     * dalekjs tool.
     */
    function analyzeFiles(files) {
      grunt.util.async.forEachSeries(files, function(f, next) {

        /**
         * adds the file path as the final argument, this goes into a new array so
         * the file doesn't get used in the next iteration.
         */
        var cmdArgs = args.concat([f]);

        /**
         * Outputs the file that is being analysed.
         */
        grunt.log.writeln(f);
        grunt.verbose.writeln('dalek ' + cmdArgs.join(' '));

        /**
         * Executes the dalekjs command.
         */
        var child = grunt.util.spawn({
          cmd: cmdArgs.shift(),
          args: cmdArgs
        }, function(error, result, code) {
          next(error);
        });

        /**
         * displays the output and error streams via the parent process.
         */
        child.stdout.on('data', function(buf) {
          var output = String(buf);
          grunt.log.writeln(output);
        });

        child.stderr.on('data', function(buf) {
          grunt.log.writeln(String(buf));
        });

      }, function () {
        done();
      });
    }

    /**
     * Retrieves defined options.
     */
    var options = this.options();
    grunt.verbose.writeflags(options, 'Options');

    var done = this.async();

    /**
     * Contains the arguments that are to be passed to dalekjs.
     */
    var args = [];

    args.push('dalek');

    /**
     * Flag indicating whether dalekjs should report to an html file.
     */
    if (options.htmlReporter) {
      args.push('-r console,html');
    }

    /**
     * Outputs the rules that have been matched.
     */
    if (options.logLevel) {
      args.push('-l');
      args.push(options.logLevel);
    }


    /**
     * Disable colorized output in the console
     */
    if (options.noColors) {
      args.push('--no-colors');
    }

    /**
     * Disable UTF-8 symbols in the console
     */
    if (options.noSymbols) {
      args.push('--no-symbols');
    }


    /**
     * Array of files that are to be analyzed by dalekjs.
     */
    var filesToBeAnalyzed = [];

    grunt.util.async.forEachSeries(this.data.src, function(f, next) {
      glob(f, options, function (er, files) {
        /**
         * Loops through the matched files and ensures that each file is only
         * processed once.
         */
        for (var j = 0; j < files.length; j++) {
          if (filesToBeAnalyzed.indexOf(files[j]) < 0) {
            filesToBeAnalyzed.push(files[j]);
          }
        }

        next();
      });
    }, function () {
      analyzeFiles(filesToBeAnalyzed);
    });
  });
};