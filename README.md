# MapSwipe Website
This is the repository for the MapSwipe's website: http://mapswipe.org/

## How to launch
1. Run terminal in the repo folder
2. Make sure running `node v.11.15.0` by running `node -v`
3. If not, install correct version from https://nodejs.org/en/download/releases/
4. `npm install`
5. `gulp develop` to start the local development version of site 
6. `gulp build` to compile production version

The rendered HTML can be found in docs. This is the folder the website points at.

## Editing CSS
- Make changes in `.scss` file in `assets/sass/*` folder
 - Note: Pages are made up of components for header, footer etc.
 - If style to be used througout site, add to `sass/global/_base.scss`
 - If page specific add to `sass/pages/*`
- Gulp will compile into `docs/assets/css/style.css`

## Adding a new CSS file
- Save file as .scss with leading underscore e.g. `_newcode.scss`
- Add file to suitable subfolder in `assets/sass`
- Update `assets/sass/style.scss` with the new file path

## Editing a JS file
- Make changes in `assets/js/*`
- gulp will compile these into `docs/assets/js/index.js`

## Adding a new JS file
- Add file to suitable subfolder in `assets/js`
- In `gulp-tasks/js-dev.js`, add filepath to `browserified`-`entries` array
- In `gulp-tasks/js.js`, add filepath to `browserified`-`entries` array
- Re-run gulp develop
- **Potential to improve this by having a filepath reference in `assets/js` - so `gulp-tasks` doesn't have to be edited directly**