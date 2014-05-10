module.exports = function (grunt) {

	grunt.initConfig({
		'concat_sourcemap': {
			options: {
				sourceRoot: '../'
			},
			vendor: {
				files: {
					'app/dist/vendor.js': ['app/vendor/**/*.js']
				}
			}
		},
		watch: {
			options: {
				spawn: false
			},
			scripts: {
				files: ['app/js/**/*.js', 'app/lib/**/*.js'],
				tasks: ['shell:browserify']
			},
			css: {
				files: ['app/css/**/*.css'],
				tasks: ['cssmin']
			},
			vendor: {
				files: ['app/vendor/**/*.js'],
				tasks: ['concat_sourcemap']
			},
			index: {
				files: ['app/index.html'],
				tasks: ['copy:cache', 'usebanner']
			}
		},
		shell: {
			browserify: {
				command: 'browserify app/init.js -d -o app/dist/bundle.js'
			}
		},
		cssmin: {
			combine: {
				files: {
					'app/dist/style.css': ['app/css/style.css']
				}
			}
		},
		uglify: {
			cupcake: {
				options: {
					sourceMap: true,
					sourceMapIncludeSources: true,
					sourceMapIn: 'dist/cupcake.js.map' // input sourcemap from a previous compilation
				},
				files: {
					'dist/cupcake.min.js': ['dist/cupcake.js']
				}
			},
			lib: {
				options: {
					sourceMap: true,
					sourceMapIncludeSources: true,
					sourceMapIn: 'dist/lib.js.map' // input sourcemap from a previous compilation
				},
				files: {
					'dist/lib.min.js': ['dist/lib.js']
				}
			}
		},
		inlineEverything: {
			templates: {
				options: {},
				files: [{
					expand: true,
					cwd: '.',
					src: 'index.html',
					dest: 'build'
				}]
			}
		},
		compress: {
			main: {
				options: {
					mode: 'gzip'
				},
				expand: true,
				cwd: 'build/',
				src: ['index.html'],
				dest: 'build/'
			}
		},
		usebanner: {
			dist: {
				options: {
					position: 'bottom',
					banner: '#<%= Date.now() %>'
				},
				files: {
					src: [ 'app/cache.appcache' ]
				}
			}
		},
		copy: {
			cache: {
				files: [
					{src: ['app/cache.appcache.tpl'], dest: 'app/cache.appcache'}
				]
			},
			build: {
				files: [
					{src: ['cache.appcache'], dest: 'build/cache.appcache'},
          {src: ['assets/**'], dest: 'build/'}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-cssmin')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-cruncher')
	grunt.loadNpmTasks('grunt-banner')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-concat-sourcemap')
	grunt.loadNpmTasks('grunt-contrib-compress')
	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-shell')

  grunt.registerTask('default', ['copy:cache', 'usebanner', 'shell:browserify', 'concat_sourcemap:vendor', 'watch'])
  grunt.registerTask('build', ['concat_sourcemap', 'cssmin', 'uglify', 'inlineEverything', 'compress', 'copy:main', 'usebanner', 'copy:build'])

}
