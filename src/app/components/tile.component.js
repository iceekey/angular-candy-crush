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
        tileID: '@', // ID of the current tile
        type: '@', // Type of the current tile
        x: '@', // Tile x position (grird index)
        y: '@', // Tile y position (grid index) 
        onSwap: '&'// Swap tiles event
    },
    controllerAs: '$',
    controller: ['$scope', '$element', function($scope, $element) {
        // Set default properties
        this.type = this.type || 0;
        if (this.type < 0 || this.type > 5) {
            throw new Error(`Tile's type should be greater or equal 0 and less than 6`);
        }
        
        this.svg = SIGNS_SVG[this.type];

        // Check move direction
        this.moveWatcher = null;
        this.moveWatcherActive = false;

        // On Swap Event emitter
        let onSwapEvent = (move) => {
            // Emit event manually
            this.onSwap({
                id: this.tileID,
                x: this.x,
                y: this.y,
                move: move
            });
        };

        this.moveChecker = (data) => {
            // Just remember position if user started to drag
            if (this.moveWatcher === null) {
                this.moveWatcher = data;
                return;
            }

            // Calculate difference
            let dx = data.x - this.moveWatcher.x;
            let dy = data.y - this.moveWatcher.y;

            // If horisontal difference's big enough
            if (Math.abs(dx) > 5 && Math.abs(dx) / Math.abs(dy) > 3.5) {
                if (dx > 0) {
                    onSwapEvent(0); // RIGHT
                } else {
                    onSwapEvent(1); // LEFT
                }
                
                this.moveWatcherActive = false;
                this.moveWatcher = null;
                return;
            }

            // If vertical difference's big enough
            if (Math.abs(dy) > 5 && Math.abs(dy) / Math.abs(dx) > 3.5) {
                if (dy > 0) {
                    onSwapEvent(2); // UP
                } else {
                    onSwapEvent(3); // DOWN
                }

                this.moveWatcherActive = false;
                this.moveWatcher = null;
            }
        };

        // Bind event liteners
        let mousedownEvent = $element.on('mousedown', ($event) => {
            this.moveWatcherActive = true;
            this.moveChecker({x: $event.clientX, y: $event.clientY});
        });

        let mousemoveEvent = $element.on('mousemove', ($event) => {
            if (this.moveWatcherActive === true) {
                this.moveChecker({x: $event.clientX, y: $event.clientY});
            }
        });

        let mouseleaveEvent = $element.on('mouseleave', () => {
            this.moveWatcher = null;
            this.moveWatcherActive = false;
        });

        $scope.$on('$destroy', function() {
            // Remove event listeners
            $element.off(mousedownEvent);
            $element.off(mousemoveEvent);
            $element.off(mouseleaveEvent);
        });        
    }]
};