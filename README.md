# default-frontend
Default frontend setup for projects. Makes use of:
* **Gulp** - Task runner
* **npm** - Package Manager for task runner modules and some site libraries/plugins
* **Bower** - Package Manager for site libraries/plugins
* **RequireJS** - Javascript dependencies
* **Angular 1.5.8** - Javascript framework
* **SC5 Style Guide Generator** - Uses KSS
* **SASS** - More powerful CSS

## Getting started

1. [Install Node.js and update NPM](https://docs.npmjs.com/getting-started/installing-node), JavaScript runtime and JavaScript package managers. [This thread](http://stackoverflow.com/questions/16151018/npm-throws-error-without-sudo) may help OSX users who encounter permissions issues when trying to install NPM.
2. [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), source control
3. [Install Bower](https://bower.io/#install-bower), front-end package manager
4. If using Windows:
    1. [Install Python 2.7 and Microsoft Visual C++ 2010](https://www.steveworkman.com/node-js/2012/installing-jsdom-on-windows/)
    2. Launch the command line and enter `$ npm config set msvs_version 2015`
    3. [Fix any errors you get](https://mlusiak.com/2013/12/22/fixing-failing-npm-packages-on-windows/) when installing  NPM packages.
5. Download the project from Git.
6. Open the terminal/command prompt and go to the project's root directory.
7. On the command line:
    1. [Install Gulp 4](https://www.liquidlight.co.uk/blog/article/how-do-i-update-to-gulp-4/)
    2. Install NPM packages:
    `$ npm install`
    3. Install bower packages:
    `$ bower install`
    4. Run gulp:
    `$ gulp serve`
