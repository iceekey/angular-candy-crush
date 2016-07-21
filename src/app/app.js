'use strict';

import './../styles/main.scss';
import './../images/favicon.png';

import angular from 'angular';

import 'angular-modal';

import controllers from './controllers';
import components from './components';
import services from './services';

angular.module('app', ['btford.modal'], function() {
    
});

components(); 
controllers();
services();