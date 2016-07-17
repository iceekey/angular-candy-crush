'use strict';

import angular from 'angular';
import {GRID_COLUMNS_COUNT, GRID_ROWS_COUNT, LEVELS} from './../config';

function getRandomTileType() {
    return Math.floor(Math.random() * 5);
}

// Grid Compoenent
export default {
    template: `
    <tile 
        ng-repeat="options in getTiles() track by options.id" 
        type="{{options.type}}" 
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
    }]
};