// adapted Gruntfile.js from https://github.com/brianreavis/selectize.js
var fs = require('fs');

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-bower-cli');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('configure', [
        'clean:pre',
        'bower:install'
    ]);

    grunt.registerTask('compile', [
        'copy:less_plugins',
        'concat:less_plugins',
        'concat:js',
        'less:uncompressed',
        'uglify',
        'clean:post'
    ]);

    grunt.registerTask('default', [
        'configure',
        'compile'
    ]);

    var files_js = [];
    var less_imports = [];
    var less_plugin_files = [];

    // enumerate plugins
    (function () {
        var selector_plugins = grunt.option('plugins');
        if (!selector_plugins) return;

        if (selector_plugins.indexOf(',') !== -1) {
            selector_plugins = '{' + selector_plugins.split(/\s*,\s*/).join(',') + '}';
        }

        // javascript
        files_js.push('src/plugins/' + selector_plugins + '/*.js');

        // less (css)
        var matched_files = grunt.file.expand(['src/plugins/' + selector_plugins + '/plugin.less']);
        for (var i = 0, n = matched_files.length; i < n; i++) {
            var plugin_name = matched_files[i].match(/src\/plugins\/(.+?)\//)[1];
            less_imports.push('@import "plugins/' + plugin_name + '";');
            less_plugin_files.push({src: matched_files[i], dest: 'dist/less/plugins/' + plugin_name + '.less'});
        }
    })();

    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        bower: {
            install: {
                options: {
                    directory: 'bower_components',
                    action: 'install'
                }
            }
        },
        clean: {
            pre: ['dist'],
            post: ['**/*.tmp*']
        },
        copy: {
            less_plugins: {
                files: less_plugin_files
            }
        },
        less: {
            options: {},
            uncompressed: {
                files: {
                    'dist/css/plugins.css': ['dist/less/plugins.less']
                }
            }
        },
        concat: {
            options: {
                stripBanners: true,
                separator: grunt.util.linefeed + grunt.util.linefeed
            },
            js: {
                files: {
                    'dist/js/plugins.js': files_js
                }
            },
            less_plugins: {
                options: {
                    banner: less_imports.join('\n') + grunt.util.linefeed + grunt.util.linefeed
                },
                files: {
                    'dist/less/plugins.less': ['dist/less/plugins.less']
                }
            }
        },
        uglify: {
            main: {
                options: {
                    'report': 'gzip',
                    'ascii-only': true
                },
                files: {
                    'dist/js/plugins.min.js': ['dist/js/plugins.js']
                }
            }
        }
    });
};