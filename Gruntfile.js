'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		clean: {
			dist: ["public/dist/js"]
		},
		copy: {
			generated: {
				src: "public/view/index.html",
				dest: "public/dist/index.html"
			}
		},
		filerev: {
			options: {
				algorithm: 'md5',
				length: 8
			},
			js: {
				src: "public/js/min.js",
				dest: "public/dist/js"
			}
		},
		useminPrepare: {
			html: "public/view/index.html",
			options: {
				root: "public",
				dest: "public/dist"
			}
		},
		usemin: {
			html: "public/dist/index.html",
			options: {
				assetsDirs: ["public", "public/dist"]
			}
		},
		jshint: {
			options: {
				laxbreak: true	
			},
			dist: ["public/js/**/*.js", "!public/js/lib.js", "!**/*.min.js", "!**/min.js"],
		},
		uglify: {
			options: {
				mangle: false,
			},
			dist: {
				src : ["public/js/app.js", "public/js/app.*.js", "!public/js/v1/*.js", "public/js/**/*.js", "!public/js/lib.js", "!**/*.min.js", "!**/min.js"],
				dest: "public/js/min.js"
			}
		},
		concat: {
			options: {
				separator: ";",
			},
			libjs: {
				src: [
					"bower_components/angular/angular.min.js", 
					//"bower_components/angular-cookies/angular-cookies.js",
					//"bower_components/angular-sanitize/angular-sanitize.min.js",
					"bower_components/angular-ui-router/release/angular-ui-router.min.js", 
					//"bower_components/angular-socket-io/socket.js", // min doesnt work
					"bower_components/moment/min/moment.min.js",
					"bower_components/angular-moment/angular-moment.js"
				],
				dest: "public/js/lib.js"
			},
			js: {
				src: [
					"public/js/lib.js",
					"public/js/min.js"
				],
				dest: "public/js/min.js"
			},
			libcss: {
				src: [
					"bower_components/font-awesome/css/font-awesome.min.css",
					"bower_components/foundation/css/foundation.min.css"
				],
				dest: "public/css/lib.css"
			},
			css: {
				src: ["public/css/lib.css", "public/css/index.css"],
				dest: "public/dist/css/min.css"
			}
		},
		sass: {
			dist: {
				files: {
					"public/css/index.css": "public/sass/import.scss"
				}
			}
		},
		watch: {
			js: {
				files: ["public/js/**/*.js", "public/js/*.js", "!**/*.min.js", "!**/min.js"],
				tasks: ["jshint:dist", "uglify:dist", "concat:libjs", "concat:js"]
			},
			sass: {
				files: ["public/sass/**/*.scss", "public/sass/*.scss"],
				tasks: ["sass:dist", "concat:css"]
			}
		}
	});
	
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-filerev");
	grunt.loadNpmTasks("grunt-usemin");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-watch");
	
	grunt.registerTask("default", [
		"copy:generated", 
		"jshint:dist", 
		"uglify:dist", 
		//"concat:libjs", 
		"concat:js", 
		"clean:dist", 
		"useminPrepare", 
		"filerev:js", 
		"usemin"
	]);
	
	grunt.registerTask("dev-css", ["concat:libcss", "sass:dist", "concat:css", "watch:sass"])
};