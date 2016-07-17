'use strict';

import angular from 'angular';

import Tile from './tile.component.js';
import Grid from './grid.component.js';

export default () => {

    let app = angular.module('app');

    app.component('tile', Tile);
    app.component('grid', Grid);
};