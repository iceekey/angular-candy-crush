# Candy Crush Saga Clone Angular.js
A small Candy Crush Saga clone that uses road signs instead of candies and written on Angular.js.

### Warning! This is my university project (low quality code) 😅. It hasn't changed since then. You could play the demo and use this code in your purposes on your own risk.

About the Game:

* Angular.js is used (hate this framework, actually, so... not my best code so far)
* Webpack bundling
* No unnecessary libraries (like lodash.js, simple and compact)
* High configurability (check configuration file)
* Easy to install (You Don't Say?) 
* Cyrillic characters support (because I'm Russian), and I guess, grammar is incorrect in this game, but who cares? 😜

### [Demo](http://surgeon-frog-83146.bitballoon.com/)

## Installation guide

Clone repository from git:

```bash
git clone https://github.com/iceekey/angular-three-in-a-row.git
```

Go to directory:

```bash
cd angular-three-in-a-row
```

Install dependencies:

```bash
npm install
```

Run application (webpack-dev-server, you can change default port in `webpack.config.js` file):

```bash
npm start
```

Or you can build application (`dist` directory) to deploy on a server:

```bash
npm run build
```

## Configuration

You can change your game configuration using `src/app/config.js` file. You also need to change `src/styles/main.scss` file.

If you want to create or modify levels, use `src/app/levels` directory.
