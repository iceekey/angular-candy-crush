'use strict';

import './../styles/main.scss';
import './../images/favicon.png';

import angular from 'angular';

import controllers from './controllers';
import components from './components';

angular.module('app', [], function() {
    
});

components();
controllers();