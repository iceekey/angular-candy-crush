'use strict';

import angular from 'angular';
import {GRID_COLUMNS_COUNT, GRID_ROWS_COUNT, LEVELS, SWAP_ANIMATION_DURATION} from './../config';

function getRandomTileType() {
    return Math.floor(Math.random() * 5);
}

// Grid Compoenent
export default {
    template: `
    <tile 
        ng-repeat="options in getTiles() track by options.id" 
        type="{{options.type}}" x="{{options.x}}" y={{options.y}}
        tile-id="options.id" on-swap="onSwap(move, x, y)"
        class="position-{{options.x}}-{{options.y}}">
    </tile>`,
    controllerAs: '$',
    controller: ['$scope', function($scope) {
        // Game grid
        $scope.grid = [];
        $scope.level = LEVELS[0];

        // Generate tiles
        let index = 0, tileType;

        // Create tiles
        $scope.$parent.createTiles = () => {
            let grid = $scope.grid;
            let level = $scope.level;

            if (!level.hasOwnProperty('tiles') || !angular.isArray(level.tiles)) {
                throw new Error(`Level configuration's damaged`);
            }

            for(let i = 0; i < GRID_COLUMNS_COUNT; i++) {
                grid[i] = [];
                for(let j = 0; j < GRID_ROWS_COUNT; j++) {
                    // Check if we have tile from level configuration
                    if (level.tiles[i][j] === 0) {
                        grid[i][j] = null;
                        continue;
                    }

                    // Don't repeat tiles three or more times
                    do {
                        tileType = getRandomTileType();
                    }
                    while ((i >= 2 && 
                        (grid[i - 1][j] !== null && grid[i - 1][j].type === tileType) &&
                        (grid[i - 2][j] !== null && grid[i - 2][j].type === tileType))
                    || (j >= 2 &&
                        (grid[i][j - 1] !== null && grid[i][j - 1].type === tileType) &&
                        (grid[i][j - 2] !== null && grid[i][j - 2].type === tileType))); 
                    
                    // Put tile into grid
                    grid[i][j] = {
                        id: index++,
                        type: tileType,
                        x: i,
                        y: j
                    };
                }
            }
        };

        $scope.getTiles = () => {
            let grid = $scope.grid;

            if(grid.length <= 0) {
                return [];
            }

            let index = 0, tiles = [];
            for(let i = 0; i < GRID_COLUMNS_COUNT; i++) {
                for(let j = 0; j < GRID_ROWS_COUNT; j++) {
                    if (grid[i][j] !== null) {
                        tiles[index++] = grid[i][j];
                    }
                }
            }

            return tiles;
        };

        // Watch grid for changes
        $scope.$watch('grid');

        // Swap event fired, change tiles positions
        $scope.onSwap = (move, x, y) => {
            let grid = $scope.grid, pulledXY = null;

            // Convert coordinates into numbers
            x = parseInt(x, 10);
            y = parseInt(y, 10);

            // Choose pulled element
            switch(move) {
            case 0: // Right
                pulledXY = (x + 1 < GRID_COLUMNS_COUNT && grid[x+1][y] !== null) ? { x: x+1, y: y } : null;
                break;
            case 1: // Left
                pulledXY = (x - 1 >= 0 && grid[x-1][y] !== null) ? { x: x-1, y: y } : null;
                break;
            case 2: // Up
                pulledXY = (y + 1 < GRID_ROWS_COUNT && grid[x][y+1] !== null) ? { x: x, y: y+1 } : null;
                break;
            case 3: // Down
                pulledXY = (y - 1 >= 0 && grid[x][y-1] !== null) ? { x: x, y: y-1 } : null;
                break;
            }
            
            // Cancel if it's impossible move
            if (pulledXY === null) {
                return;
            }

            let _x = pulledXY.x, _y = pulledXY.y;
            let pushed = grid[x][y], 
                pulled = grid[_x][_y];

            pushed.x = _x;
            pushed.y = _y;

            pulled.x = x;
            pulled.y = y;

            setTimeout(() => {
                grid[x][y] = pulled;
                grid[_x][_y] = pushed;

                $scope.grid = angular.copy(grid);
                $scope.$digest();
            }, SWAP_ANIMATION_DURATION);

            $scope.grid = angular.copy(grid);
            $scope.$digest();
        };
    }]
};