module.exports = function(grunt) {
    "use strict";
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        
        
        // The lint task will run the build configuration and the application
        // JavaScript through JSHint and report any errors.  You can change the
        // options for this task, by reading this:
        // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md
      
        // Set our jshint options here:
        // http://www.jshint.com/options/
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: false,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    Modernizr: false,
                    console: false,
                    FB: false,
                    google: false,
                    jQuery: false,
                    _: false
                }
            },
            all: {
                src: ['js/main.js']
            }
        },
        
        // The concatenate task is used here to all libraries from the lib
        // folder.  We exclude jQuery, because we call that from Google's
        // CDN.
        // You may or may not want to include the JS we write depending on how
        // often it changes.
        
        concat: {
            options: {
                separator: ';'
            },
            dev: {
                src: ["bower_components/modernizr/modernizr.js", "bower_components/jquery-placeholder/jquery.placeholder.js", "js/vendor/!(jquery-1.10.1)*.js", "js/plugins.js"],
                dest: "js/source.dev.js"
            },
            dist: {
                src: ["bower_components/modernizr/modernizr.js", "bower_components/jquery-placeholder/jquery.placeholder.js", "js/vendor/!(jquery-1.10.1)*.js", "js/plugins.js"],
                dest: "dist/js/source.js"
            }
        },
        
        clean: {
            clean: ['dist/*']
        },
        
        uglify: {
            options: {
              banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            
            // Takes the built sourcejs file and minifies it for filesize benefits.
            // Create a minified version in case you need to test minification locally.
            min: {
                src: ["dist/js/source.js"],
                dest: "dist/js/source.min.js"
            }
        },
          
        sass: {
            dist: {
                options: {
                    style: 'compact',
                    compass: 1,
                    debugInfo: false,
                    lineNumbers: false
                },
                files: {
                    'dist/css/styles.css': 'styles/scss/styles.scss', // 'destination': 'source'
                    'dist/css/styles-desktop.css': 'styles/scss/styles-desktop.scss'
                }
            },
            dev: {
                options: {
                    style: 'expanded',
                    compass: 1,
                    lineNumbers: 1
                },
                files: {
                    'styles/css/styles.dev.css': 'styles/scss/styles.scss',
                    'styles/css/styles-desktop.dev.css': 'styles/scss/styles-desktop.scss'
                }
            }
        },
        
        // This sets up watch configurations
        watch: {
            all: {
                files: ['styles/sass/*.scss', 'js/*.js'],
                tasks: ['default']
            },
            sass: {
                files: ['styles/sass/*.scss'],
                tasks: ['sass:dev']
            }
        },
        copy: {
            dist: {
                files: {
                  "dist/<%= pkg.sites[0].short_name %>/js/source-min.js": "dist/js/source.min.js",
                  "dist/<%= pkg.sites[0].short_name %>/js/source.js": "dist/js/source.js",
                  "dist/js/main.js": "js/main.js",
                  "dist/<%= pkg.sites[0].short_name %>/js/main.js": "js/main.js",
                  "dist/<%= pkg.sites[0].short_name %>/style/index.css": "dist/css/styles.css",
                  "dist/<%= pkg.sites[0].short_name %>/style/index-desktop.css": "dist/css/styles-desktop.css"
                }
            }
        },
    });
    
    
    // Load the grunt plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-ftp-deploy');

    grunt.loadTasks('grunt');

    // Default task(s).
    grunt.registerTask("common", ['clean', 'jshint:all', 'concat', 'uglify']);
    grunt.registerTask("default", ['common', 'sass:dev', 'watch:sass']);
    grunt.registerTask("release", ['common', 'sass:dist', 'copy']);
    // grunt.registerTask("deploy", ['common', 'sass:dist', 'copy', 'mountee:site1:deploy']);
};
