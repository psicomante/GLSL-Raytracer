'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // File system lib
  var fs = require('fs');

  // Folders config
  var config = {
    demo: 'demo',
    src: 'src',
    test: 'test',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // reads the package files to use info there in Grunt
    pkg: grunt.file.readJSON('package.json'),

    // Project settings
    config: config,

    // Concatenate all the src files
    concat: {
      dist: {
        options: {
          // preprocess source files using grunt.template.process defaults.
          // used in "version.js" to add the pkg version
          process: true,
          separator: "\n\n",
          // strip all banners except /*! ... */
          stripBanners: true,
          sourcesContent: true
        },
        src: [
          // add the source files in order
          // firstly add _intro.js and main.js, then all the .js (including subfolders) but excluding "_outro.js" and "version" (because the default glob order is alphabetical).
          // eventually add version.js and _outro
          '<%= config.src %>/_intro.js',
          '<%= config.src %>/main.js',
          [
            '<%= config.src %>/**/*.js',
            '!<%= config.src %>/version.js',
            '!<%= config.src %>/_outro.js',
          ],
          '<%= config.src %>/version.js',
          '<%= config.src %>/_outro.js',
        ],
        dest: '<%= config.dist %>/<%= pkg.name %>.js'
      },
    },

    // Uglify the js
    uglify: {
      options: {
        banner: '/*! <%= pkg.name.replace(".js", "") %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        mangle: false,
        sourceMap: true,
        sourceMapName: '<%= config.dist %>/<%= pkg.name %>.min.js.map'
      },
      dist: {
        files: {
          '<%= config.dist %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    // Unit test
    qunit: {
      files: ['<%= config.test %>/*.html']
    },

    jshint: {
      options: {
        globals: {
          console: true,
          module: true,
          document: true
        }
      },
      pre: {
        files: '<%= config.src %>/main.js',
        options: {
          jshintrc: '.jshintrc'
        }
      },
      post: {
        files: {
          src: ['<%= config.dist %>/webglass.js'],
        },
        options: {
          jshintrc: '.post.jshintrc'
        }
      }
    },

    // watch config
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['shell:bowerInstall']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        options: {
          reload: true
        }
      },
      test: {
        files: ['./<%= config.src %>/{,*/}*.{js,glsl}'],
        tasks: ['jshint:pre', 'concat', 'qunit', 'uglify'],
        options: {
          livereload: true
        }
      },
      demo: {
        files: [
          './<%= config.dist %>/{,*/}*.js',
          './<%= config.demo %>/{,*/}*.js',
          './<%= config.demo %>/{,*/}*.css',
          './<%= config.demo %>/{,*/}*.html'
        ],
        options: {
          livereload: true
        }
      },
      livereload: {
        options: {
          livereload: './<%= connect.options.livereload %>'
        },
        files: [
          './<%= config.dist %>/{,*/}*.js',
          './<%= config.demo %>/{,*/}*.js',
          './<%= config.demo %>/{,*/}*.css',
          './<%= config.demo %>/{,*/}*.html'
        ]
      }
    },

    shell: {
      bowerInstall: {
        command: 'bower install'
      }
    },

    // The grunt server config
    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        hostname: 'localhost'
      },
      livereload: {
        options: {}
      }
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: [],
        commit: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'], // '-a' for all files
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
      }
    }

  });

  grunt.registerTask('demo', function () {
    grunt.task.run([
      'jshint:pre',
      'concat',
      'uglify',
      'connect:livereload',
      'watch'
    ]);
  });
  grunt.registerTask('test', ['jshint:post', 'qunit']);
  grunt.registerTask('default', ['jshint:pre' ,'concat', 'jshint:post', 'qunit', 'uglify']);
  // grunt.registerTask('concat', ['concat_sourcemap']);

  // build without the jshint and qunit shit
  grunt.registerTask('build', ['concat', 'uglify']);

  // creates a server on port 9000 and watches the changes
  grunt.registerTask('serve', ['connect', 'watch']);
};
