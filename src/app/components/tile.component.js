'use strict';

import './../../images/signs/0.svg';
import './../../images/signs/1.svg';
import './../../images/signs/2.svg';
import './../../images/signs/3.svg';
import './../../images/signs/4.svg';
import './../../images/signs/5.svg';

const SIGNS_SVG = [
    './../../images/signs/0.svg',
    './../../images/signs/1.svg',
    './../../images/signs/2.svg',
    './../../images/signs/3.svg',
    './../../images/signs/4.svg',
    './../../images/signs/5.svg'
];

// Tile Component
export default {
    template: `<ng-include src="$.svg"></ng-include>`,
    bindings: {
        type: '@'
    },
    controllerAs: '$',
    controller: function() {
        // Set default properties
        this.type = this.type || 0;
        if (this.type < 0 || this.type > 5) {
            throw new Error(`Tile's type should be greater or equal 0 and less than 6`);
        }
        
        this.svg = SIGNS_SVG[this.type];        
    }
};