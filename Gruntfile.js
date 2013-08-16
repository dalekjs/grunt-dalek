'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    dalek: {
      options: {
        /**
         * Invoke the html reporter
         */
        htmlReporter: true,
        /**
         * Log level, controls the amount of information outputted to the console (0 to 5)
         */
        logLevel: 2,
        /**
         * Disable colorized output in the console
         */
        noColors: false,
        /**
         * Disable UTF-8 symbols in the console
         */
        noSymbols: false
      },
      dist: {
        src: ['test/example/test-dkd.js','test/example/test-github.js']
        //src: ['test/example/test-github.js']
      }
    }

  });

  /**
   * Loads tasks located in the tasks directory.
   */
  grunt.loadTasks('tasks');

  grunt.registerTask('default', ['dalek']);
};