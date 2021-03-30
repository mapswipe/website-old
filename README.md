# MapSwipe Website
This is the repository for the MapSwipe website: https://mapswipe.org/

You can find more information about the app itself in the [main app repository.](https://github.com/mapswipe/mapswipe)

## Deployment process
The website is compiled using gulp. When any changes are pushed to the master branch, GitHub actions builds the site and deploys to the `gh-pages` branch - which is the root of the website.

The following instructions explain how to setup a local development environment and make changes so that they are compiled correctly.

## How to launch
1. Run terminal in the repo folder
2. Make sure running `node v.11.15.0` by running `node -v`
3. If not, install correct version from https://nodejs.org/en/download/releases/
   * for Ubuntu you can check here [how to install nvm](https://github.com/nvm-sh/nvm) and then run `nvm install v11.15.0`
   * you might need to install gulp as well: `npm install --global gulp-cli`
4. `npm install`
6. `gulp develop` to start the local development version of site 
   * If gulp does not work, it could be that PATH is not set. Run `node_modules/.bin/gulp develop`
7. Any changes to certain files (such as shtml), will trigger the site to rebuild locally

The rendered HTML can be found in `/docs` and split into language subfolders - this is all git-ignored as the deployment is done by GitHub Actions.

## Content changes
The `.shtml` files are used to compile all the language versions but the text is pulled from the language files in`locales/<lang>.json` with `/en.json` being the source language.

**NOTE:** there is text in the shtml files but it is only there for reference. It is replaced during the build process and may be out of date.

### Making changes to text
- Find the string in `locales/en.json` and change there
	- Strings are sorted by page and you can can cross reference the JSON id used in the `data-i18n` tag to find it's place on page

### Adding new text
- Add HTML tag as normal in the shtml page
- Add the `data-i18n` attribute to the HTML tag with a unique id for the text
	-  Must follow [page].[identifier] e.g. `data-i18n="homepage.hero-heading"`
- Add the new `data-i18n` identifier to `locales/en.json`
	- Must be nested properly within the correct page
	- Please put in order of page (for easy reference, not technical requirement)

### Translating text
- When any changes to `locales/en.json` are pushed to Github, they are automatically sent to Transifex for translation.
- When a language is 100% complete, Transifex will open a PR to add/update the language to `locales/<lang>.json`.
- Any strings not translated, will fall back to English.
- Full details of the translation process, including adding new languages are below.

## CSS
### Editing existing CSS
- Make changes in `.scss` file in `assets/sass/*` folder
  - Note: Pages are made up of components for header, footer etc.
  - If style to be used throughout site, add to `sass/global/_base.scss`
  - If page specific add to `sass/pages/_*.scss`
- Gulp will compile into `docs/assets/css/style.css`

### Adding a new CSS file
- Save file as .scss with leading underscore e.g. `_newcode.scss`
- Add file to suitable subfolder in `assets/sass`
- Update `assets/sass/style.scss` with the new file path

## Javascript
### Editing a JS file
- Make changes in `assets/js/*`
- gulp will compile these into `docs/assets/js/index.js`

### Adding a new JS file
- Add file to suitable subfolder in `assets/js`
- In `gulp-tasks/js-dev.js`, add filepath to `browserified`-`entries` array
- In `gulp-tasks/js.js`, add filepath to `browserified`-`entries` array
- Re-run gulp develop
- **Potential to improve this by having a filepath reference in `assets/js` - so `gulp-tasks` doesn't have to be edited directly**

## Translation 
### How it works
During gulp build/develop, the shtml files are compiled into html files, then each file is passed through the translation process, where each tag that has a `data-i18n` attribute will be translated, and the result injected into the output file. Whatever text was present before will be replaced.
The resulting translation is hardcoded in the output, so no need for any javascript on the client side to see the language.
This uses `i18next` to translate, so it's the same system as the app, so knowledge there should be usable here, mostly.

The gulp code is not very pretty, and not optimised, in part because it reloads everything for each file, but it all happens in less than 2 seconds, so no big deal.

### Adding a newly translated language
- Once the new language has been committed from Transifex, it will need adding to the build process
- There are three places to add it in `gulp-tasks/html.js`
	- These are pretty clear from the existing languages!
- It will also need adding to the language selector (but this is yet to be deployed)

### Redirects
To prevent having duplicate English pages (with `/en` and without), the `/docs` folder contains a meta redirect for each page sending the root version to the /en version. e.g. https://mapswipe.org/index.html > https://mapswipe.org/en/index.html