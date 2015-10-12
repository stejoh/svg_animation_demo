module.exports = function(grunt) {
	var configs = {
		js_combine_files: [
			'src/vendor/jquery/dist/jquery.min.js',
            'src/vendor/vivus/dist/vivus.min.js',
            'src/vendor/Snap.svg/dist/snap.svg-min.js',
			'src/js/main.js'
        ],
		js_hint_files: [
            'Gruntfile.js',
            'src/js/**/*.js'
        ],
		watch_files: ['src/**/*.*']
	};
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		connect: {
			server: {
				options: {
					port: 9000,
					base: 'dist'
				}
			},
			dist: {
				options: {
					port: 9000,
					base: 'dist',
					keepalive: true
				}
			}
		},
		includereplace: {
			dist: {
				options: {
					globals: {
						name: '<%= pkg.name %>',
						city: 'img/svg/City.svg'
					}
				},
                src: 'src/templates/_root.html',
                dest: 'temp/ugly/index.html'
			}
		},
        prettify: {
            options: {
				"indent": 4,
				"indent_char": " ",
				"indent_scripts": "normal",
				"wrap_line_length": 0,
				"brace_style": "collapse",
				"preserve_newlines": true,
				"max_preserve_newlines": 1,
				"unformatted": [
					"a",
					"code",
					"pre"
				]
            },
			html: {
				src: 'temp/ugly/index.html',
				dest: 'dist/index.html'
			},
			svg: {
				files: [
                    {
                        expand: true,
                        cwd: 'temp/ugly/img/svg',
                        src: ['*.svg'],
                        dest: 'dist/img/svg',
                        ext: '.svg',
                        extDot: 'last'
                    }
                ]
			}

        },
        svgmin: {
            options: {
                plugins: [
                    { removeViewBox: false },
					{ removeUselessStrokeAndFill: true },
                    { cleanupIDs: false },
                    { removeHiddenElems: false },
                    { convertShapeToPath: false },
                    { mergePaths: false }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/img/svg',
                        src: ['*.svg'],
                        dest: 'temp/ugly/img/svg',
                        ext: '.svg',
                        extDot: 'last'
                    }
				]
            }
        },
		sass: {
			options: {
				sourceMap: true
			},
			dist: {
				files:
                {
					"dist/css/combined.min.css": "src/sass/main.scss"
				}
			}
		},
		jshint: {
			beforeconcat: configs.js_hint_files
		},
		concat: {
			options: {
				separator: ';\n',
                sourceMap: true,
                stripBanners: true
			},
			dist: {
				src: configs.js_combine_files,
				dest: 'dist/js/compiled.min.js'
			}
		},
		uglify: {
			my_target: {
				files: {
					'dist/js/compiled.min.js': 'dist/js/compiled.min.js'
				}
			}
		},
		postcss: {
			options: {
				map: {
					inline: false
				},
				processors: [
				require('autoprefixer')({
					browsers: '> 0%'
				}), require('cssnano')()]
			},
			dist: {
				src: 'dist/css/*.css'
			}
		},
		watch: {
			src: {
				files: configs.watch_files,
				tasks: ['build']
			}
		}
	});
	// Add plugins
	require('load-grunt-tasks')(grunt);
	// Register tasks
	grunt.registerTask('build', ['includereplace', 'prettify:html', 'sass', 'concat', 'jshint']);
	grunt.registerTask('dist', ['build', 'postcss', 'uglify']);
	grunt.registerTask('default', ['build', 'connect:server', 'watch']);
    grunt.registerTask('svg', ['svgmin', 'prettify:svg']);

    grunt.event.on('watch', function(action, filepath) {
		grunt.log.writeln(filepath + ' has ' + action);
	});
};