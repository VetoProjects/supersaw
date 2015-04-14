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
                src: ['effects/*.js']
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
              'dist/js/deploy.js': ['effects/*.js']
            }
          }
        },
        watch: {
            files: '**/*.js',
            tasks: ['uglify:js', 'gjslint:js']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-gjslint');

    grunt.registerTask('default', ['gjslint', 'connect', 'watch', 'uglify:js']);
}
