# Candy Crush Saga Clone Angular.js
A small Candy Crush Saga clone that uses road signs instead of candies and written on Angular.js.

What about this game:

* Angular.js
* Webpack bundling
* No unnecessary libraries (like lodash.js)
* High configurability (check configuration file)
* Easy to install
* Cyrillic characters support

## Installation guide

Download repository from git:

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

Or you can build application (dist directory) to deploy on a server:

```bash
npm run build
```

## Configuration

You can change your game configuration using `src/app/config.js` file. You also need to change `src/styles/main.scss` file.

If you want to create or modify levels, use `src/app/levels` directory.