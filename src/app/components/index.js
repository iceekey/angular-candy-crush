'use strict';

import angular from 'angular';

import Tile from './tile.js';

export default () => {

    let app = angular.module('app');

    app.component('tile', Tile);
};