module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: './public'
                }
            }
        },
        gjslint: {
            options: {
              flags: [ '--disable 110', '--nojsdoc' ],
              reporter: {
                name: 'console'
              }
            },
            js: {
                src: ['public/lib/*/*.js', 'public/src/*.js']
            }
        },
        uglify: {
          options: {
            beautify: true,
            report: 'min',
            sourceMap: true,
            sourceMapIncludeSources: true
          },
          js: {
            files: {
              'public/dist/js/deploy.js': [
                      'public/lib/effects/object.js',
                      'public/lib/*/*.js',
                      //Does not work, no "of" support in gjslint
                      //'public/lib/*.js',
                      'public/src/*.js'
                      ]
            }
          }
        },
        watch: {
            prod: {
                files: ['public/**/*.js', 'html/**/*.html', '!public/dist/js/*'],
                tasks: [
                  'uglify:js',
                  // 'gjslint:js',
                  'preprocess:prod',
                ]
            },
            dev: {
                files: ['./public/**/*.js', './html/**/*.html', '!public/dist/js/*'],
                tasks: [
                  // 'gjslint:js',
                  'preprocess:dev',
                ]
           }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            prod: {
                tasks: ['watch:prod']
            },
            dev: {
                tasks: ['watch:dev']
            }
        },
        preprocess: {
            prod: {
                src: './html/index.html',
                dest: './public/index.html',
                options: {
                    context: {
                      NODE_ENV: 'production'
                    }
                }
            },
            dev: {
                src: './html/index.html',
                dest: './public/index.html',
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-gjslint');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-preprocess');

    grunt.registerTask('prod', [
      // 'gjslint',
      'uglify',
      'connect',
      'preprocess:prod',
      'concurrent:prod',
    ]);
    grunt.registerTask('dev', [
      // 'gjslint',
      'connect',
      'preprocess:dev',
      'concurrent:dev',
    ]);
    grunt.registerTask('default', ['dev']);
}
