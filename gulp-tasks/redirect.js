'use strict';

//Adds redirects for all existing pages (in English) to go to /en version and set as canonical. This avoids duplicate English page versions.

module.exports = function (gulp) {
    const rename = require('gulp-rename');
    const replace = require('gulp-replace');
    // Add all existing pages to array
    var pages = ['about.html','cookies.html','data.html','get-involved.html','index.html','privacy.html','project.html']

    //For each page create a redirect based on the /redirect.shtml
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