/*jslint node:true, esnext: true */
'use strict';


module.exports = function (gulp) {
    const { JSDOM } = require('jsdom');
    const plumber = require('gulp-plumber'),
        html = require('gulp-html-ssi'),
        rename = require('gulp-rename'),
        path = require('path'),
        i18next = require('i18next'),
        jqueryI18next = require('jquery-i18next'),
        through2 = require('through2'),
        Path = require('path'),
        browserSync = require('browser-sync');

    // import the translations here, one for each language
    // make sure to use them under "resources" about 25 lines below
    const translationEN = require('../locales/en');
    const translationFR = require('../locales/fr');

    // list the languages you want to translate to
    // each one will get a dedicated folder under /<lang>/
    const supportedLangs = [
        'en',
        'fr',
    ];
    return function () {
        var output = [];
        // run the "normal" html pipeline but for each language
        // adding a step to translate before copying the files
        // to /docs/
        supportedLangs.forEach((langCode) => {
            output.push(gulp.src(['./*.shtml','./**/*.shtml'])
                .pipe(html({root: path.resolve('./')}))
                .pipe(rename(function (path) {
                    path.extname = ".html";
                }))
                .pipe(through2.obj(function(file, _, cb) {
                    // init the translation system for each language
                        i18next.init({
                          lng: langCode,
                          debug: false,
                          resources: {
                              // add one line for each language
                              en: { translation: translationEN },
                              fr: { translation: translationFR },
                          }
                        }, function(err, t) {
                            // build a fake window so jQuery can run on it
                            const dom = new JSDOM(file.contents.toString());
                            const { window } = dom;
                            const $ = require('jquery')(window);
                            jqueryI18next.init(i18next, $, {
                                tName: 't',
                                i18nName: 'i18n',
                                handleName: 'localize',
                                selectorAttr: 'data-i18n',
                                targetAttr: 'i18n-target',
                                optionsAttr: 'i18n-options',
                                useOptionsAttr: false,
                                parseDefaultValueFromContent: true
                            });
                            $('*[data-i18n]').localize();
                            file.contents = Buffer.from(dom.serialize());
                            cb(null, file);
                        });
                    // this is where we actually translate
                }))
                // copy the results to the language folder
                .pipe(gulp.dest(`docs/${langCode}/`))
            );
        });
        return output;
    };
};
