
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        options: { debug: false },
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            app: {
                src: ['src/app/app.js'],
                dest: 'build/static/build/app.js',
                options: {
                    paths: ['./node_modules','./src/app'],
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'build/static/build/main.css': 'src/scss/main.scss'
                }
            }
        },
        copy: {
            html: {
                mode: 644,
                files: [{ src: 'src/templates/*.html', dest: 'build/', flatten: true, expand: true }]
            },
            img: {
                mode: 644,
                files: [{ src: 'src/img/*', dest: 'build/static/img/', flatten: true, expand: true }]
            },
            mov: {
                mode: 644,
                files: [{ src: 'src/mov/*', dest: 'build/mov/', flatten: true, expand: true }]
            }
        },
        clean: {
            build: ['build']
        },
        browserSync: {
            dev: {
                bsFiles: { src : 'build/**' },
                options: {
                    watchTask: true,
                    server: { baseDir: 'build' }
                }
            }
        },
        watch: {
            app: {
                files: ['src/app/**/*.js'],
                tasks: ['build:app'],
                options: {
                    spawn: false,
                }
            },
            sass: {
                files: ['src/scss/**/*.scss'],
                tasks: ['build:css'],
                options: {
                    spawn: false
                }
            },
            html: {
                files: ['src/templates/**/*.html'],
                tasks: ['build:html'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.registerTask('default', []);
    grunt.registerTask('build', ['clean', 'copy', 'browserify', 'sass']);
    grunt.registerTask('build:app', ['browserify']);
    grunt.registerTask('build:css', ['sass']);
    grunt.registerTask('build:html', ['copy:html']);
    grunt.registerTask('develop', ['clean', 'browserify', 'sass', 'copy', 'browserSync', 'watch']);

};
