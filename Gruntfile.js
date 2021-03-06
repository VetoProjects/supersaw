module.exports = function (grunt) {
   const jsFiles = [
      'lib/widgets/VolumeMeter.js',
      'lib/widgets/analyzer.js',
      'lib/widgets/equalizer.js',
      'lib/widgets/crossfader.js',
      'lib/widgets/pitch.js',
      'lib/widgets/player.js',
      'lib/widgets/mixer.js',
      'lib/effects/object.js',
      'lib/effects/lowPass.js',
      'lib/effects/moog.js',
      'lib/effects/bitcrusher.js',
      'lib/effects/noiseConvolver.js',
      'lib/effects/pinking.js',
      'lib/midi.js',
      'src/main.js',
      'lib/widgets/knob.js',
    ];

    const pubJsFiles = jsFiles.map(path => `public/${path}`);

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
                src: pubJsFiles
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
              'public/dist/js/deploy.js': pubJsFiles
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
                      JS_FILES: 'dist/js/deploy.js'
                    }
                }
            },
            dev: {
                src: './html/index.html',
                dest: './public/index.html',
                options: {
                    context: {
                        JS_FILES: jsFiles.join(',')
                    },
                }
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
