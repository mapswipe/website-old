'use strict';

module.exports = function (gulp) {
    const rename = require('gulp-rename');

    return function () {
        return gulp.src('./redirect.shtml')
                .pipe(rename("index.html"))
                .pipe(gulp.dest('./docs/'));
    };
};