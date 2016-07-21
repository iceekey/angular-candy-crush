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
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: { presets: ['es2015'] } },
            { test: /\.(html|json)$/, loader: 'raw' },
            { test: /\.scss$/, loader: scss.extract('style-loader', 'css!postcss!sass') },
            { test: /\.css$/, loader: scss.extract('style-loader', 'css!postcss') },
            { test: /\.(jpg|jpeg|gif|png|ico)$/, exclude: /node_modules/, loader: `file-loader?name=images/[name].[ext]` },
            { test: /.*signs.*\.svg$/, exclude: /node_modules/, loader: `file-loader?name=images/signs/[name].[ext]` },
            { test: /.*fonts.*\.svg$/, loader: 'file-loader?mimetype=image/svg+xml&name=fonts/[name].[ext]' },
            { test: /.*fonts.*\.woff$/, loader: 'file-loader?mimetype=application/font-woff&name=fonts/[name].[ext]' },
            { test: /.*fonts.*\.woff2$/, loader: 'file-loader?mimetype=application/font-woff&name=fonts/[name].[ext]' },
            { test: /.*fonts.*\.ttf$/, loader: 'file-loader?mimetype=application/octet-stream&name=fonts/[name].[ext]' },
            { test: /.*fonts.*\.eot$/, loader: 'file-loader?name=fonts/[name].[ext]'},
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