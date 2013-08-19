# grunt-dalek

> Run browser tests with dalak

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

## The "dalekjs" task

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

#### options.htmlReporter
Type: `Boolean`
Default: `true`

Invoke the html reporter

#### options.logLevel
Type: `Integer`
Default: `2`

Log level, controls the amount of information outputted to the console (0 to 5)

### options.noColors
Type: `Boolean`
Default: `false`

Disable colorized output in the console

### options.noSymbols
Type: `Boolean`
Default: `false`

Disable UTF-8 symbols in the console



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
    }
}
```
