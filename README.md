<h1 align="center">Wardrobe</h1>

<p align="center">
  <a href="https://app.netlify.com/sites/mywardrobe/deploys"><img src="https://api.netlify.com/api/v1/badges/dd13f707-aa91-4842-a4ab-a0e6bbc475f4/deploy-status" alt="Deploy Status"></a>
  <a href="https://circleci.com/gh/ooxxro/wardrobe/tree/master"><img src="https://img.shields.io/circleci/project/github/ooxxro/wardrobe/master.svg?sanitize=true" alt="Test Status"></a>
<!--   <a href="https://codecov.io/github/ooxxro/wardrobe?branch=master"><img src="https://img.shields.io/codecov/c/github/ooxxro/wardrobe/master.svg?sanitize=true" alt="Coverage Status"></a> -->
</p>

## README for Iteration 3 Progress Report

Online Website: [https://mywardrobe.netlify.app](https://mywardrobe.netlify.app).  
To build the application, you need node.js and npm installed.  
After cloning this repo, run `npm install` to install dependencies.  
Run `npm start` to start the development server.  
Run `npm run e2e` to run Cypress automated end to end tests.

## README for Iteration 2 Progress Report

Online Website: [https://mywardrobe.netlify.app](https://mywardrobe.netlify.app).  
To build the application, you need node.js and npm installed.  
After cloning this repo, run `npm install` to install dependencies.  
Run `npm start` to start the development server.  
Run `npm test` to run unit tests.  
Run `npm test -- --coverage --watchAll=false` to run for the code coverage.

## README for Iteration 1 Progress Report

Online Website: [https://mywardrobe.netlify.app](https://mywardrobe.netlify.app).  
To build the application, you need node.js and npm installed.  
After cloning this repo, run `npm install` to install dependencies.  
Run `npm start` to start the development server.  
Run `npm test` to run unit tests.

## Getting Started

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

#### node.js and npm

First you need `node.js` installed, which will also come with `npm` (node package manager). Run `node -v` and `npm -v` to and make sure you have both of them.

After cloning this repo, run `npm install` in the root directory in this project. This will install all the required dependencies. Dependencies are managed by [NPM](https://www.npmjs.com/), it works by tracking all the dependencies and their versions in `package.json`, and will download them in the `node_modules` folder. The first time you run `npm install` may take forever, but the results are cached and should be fast when you only need to update some packages.

#### IDE

I recommend using [VSCode](https://code.visualstudio.com/) when developing, as we can share common settings like code-formatting options. These settings are stored in `.vscode/settings.json`.

When you open this repo with VSCode, it will prompt you to install recommended extensions (listed in `.vscode/extensions.json`).

## Available Scripts

To start the server for development:

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## UI Framework & Libraries

I installed 2 UI Frameworks, because both are popular and contains a lot of ready-to-use components, so we don't need to re-invent the wheel!

- [Material-UI](https://material-ui.com/)
- [Ant Design](https://ant.design/)

#### styles

To avoid CSS leaking to all pages, only add global styles in `index.css` if you want the style to be applied to all pages.

To add "scoped" style to a component or a page, please use [Styled-Components](https://styled-components.com/). Check out `Header.js` for example usage.

## Directory Structure

```sh
├── build # output of compiled result, ignored by git
├── config-overrides.js # override create-react-app settings
├── firebase # firebase database/storage settings
├── functions # firebase cloud functions source code
├── package-lock.json # auto-generated, do not edit
├── package.json # tracks npm package dependencies
├── public # only put files that don't need bundle
└── src # all source code lives in here
    ├── App.js # all the routes are defined here!
    ├── components # put all components in this folder
    │   ├── Header.js
    |   ├── ...
    │   └── SignUp.js
    ├── images # put images here
    ├── index.css # global css, only add styles if want to apply to every page
    ├── index.js # entry point for front-end
    └── stores # global stores shared across components
        └── UserStore.js # store about current loggedin user
```

## Learn More about advanced create-react-app settings

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
