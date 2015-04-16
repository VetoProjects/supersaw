module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: './'
                }
            }
        },
        gjslint: {
            options: {
              flags: [ '--disable 110' ],
              reporter: {
                name: 'console'
              }
            },
            js: {
                src: ['lib/*/*.js', 'src/*.js']
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
              'dist/js/deploy.js': [
                      'lib/effects/object.js', 
                      'lib/*/*.js', 
                      'src/*.js'
                      ]
            }
          }
        },
        watch: {
            prod: {
                files: ['**/*.js', '!dist/js/*'],
                tasks: ['uglify:js', 'gjslint:js']
            },
            dev: {
                files: ['**/*.js', '!dist/js/*'],
                tasks: ['gjslint:js']
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
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-gjslint');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['gjslint', 'uglify', 'connect', 'concurrent:prod']);
    grunt.registerTask('dev', ['gjslint', 'connect', 'concurrent:dev']);
}
