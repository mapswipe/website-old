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
   * for Ubuntu you can check here [how to install nvm](https://github.com/nvm-sh/nvm) to install nvm and then run `nvm install v11.15.0`
   * you might need to install gulp as well: `npm install --global gulp-cli`
4. `npm install`
6. `gulp develop` to start the local development version of site 
   * If gulp does not work, it could be that PATH is not set. Run `node_modules/.bin/gulp develop`

The rendered HTML can be found in `/docs` - this is git-ignored as the deployment is done by GitHub Actions.

## Content changes
- Edit the `.shtml` file of the existing page
- Or create a new one copying the setup of an existing page with the components
- Gulp will combine the components and save html into `/docs`

## CSS
### Editing existing CSS
- Make changes in `.scss` file in `assets/sass/*` folder
  - Note: Pages are made up of components for header, footer etc.
  - If style to be used througout site, add to `sass/global/_base.scss`
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
