'use strict';

let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let path = require('path');

let precss =  require('precss');
let autoprefixer = require('autoprefixer');

const DEV_DIR = 'src';
const APP_DIR = 'dist';

let html = new HtmlWebpackPlugin({ template: path.resolve(DEV_DIR, 'index.html'), filename: 'index.html' });
let scss = new ExtractTextPlugin('[name].css');

module.exports = {
    entry: path.resolve(DEV_DIR, 'app/app.js'),
    output: {
        path: APP_DIR,
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [
            { 
                test: /\.js$/, exclude: /node_modules/, loader: 'babel', 
                query: { presets: ['es2015'] }
            },
            { test: /\.html$/, loader: 'raw' },
            { test: /\.scss$/, loader: scss.extract('style-loader', 'css!postcss!sass') }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    postcss: function () {
        return [precss, autoprefixer];
    },
    plugins: [html, scss],
    devServer: {
        historyApiFallback: true,
        port: 2000
    }
};