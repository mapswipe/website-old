'use strict';

module.exports = function (gulp) {
    const rename = require('gulp-rename');
    const replace = require('gulp-replace');
    var pages = ['about.html','cookies.html','data.html','get-involved.html','index.html','privacy.html','project.html']

    return function () {
    	var output = [];
    	pages.forEach((page)=>{

	        output.push(gulp.src('./redirect.shtml')
                .pipe(rename(page))
                .pipe(replace(/PAGENAME/g, page))
                .pipe(gulp.dest('./docs/'))
	        );
        });
    };
};