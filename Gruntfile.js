module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

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
        js: {
            base: {
                src: ['effects/*.js'],
                dest: 'js',
                options: {
                    basePath: 'lib'
                }
            }
        },
        watch: {
            files: '**/*.js',
            tasks: ['js']
        }
    });

    grunt.registerTask('default', ['connect', 'watch']);
}
