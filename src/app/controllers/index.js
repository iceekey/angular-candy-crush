'use strict';

import angular from 'angular';

import GameController from './game.controller.js';

export default () => {

    let app = angular.module('app');

    app.controller('GameController', GameController);
};