'use strict';

import angular from 'angular';

import GameController from './game.controller.js';
import ModalController from './modal.controller.js';

export default () => {

    let app = angular.module('app');

    app.controller('GameController', GameController);
    app.controller('ModalController', ModalController);
};