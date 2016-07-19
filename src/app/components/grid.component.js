/*globals Promise:true*/

'use strict';

import angular from 'angular';
import {
    GRID_COLUMNS_COUNT, 
    GRID_ROWS_COUNT, 
    SWAP_ANIMATION_DURATION, 
    REMOVE_ANIMATION_DURATION,
    SCORE_ANIMATION_DURATION,
    CHAIN_REMOVE_COST,
    CHAIN_LENGTH_BONUS
} from './../config';

function getRandomTileType() {
    return Math.floor(Math.random() * 5);
}

// Grid Compoenent
export default {
    template: `
    <tile 
        ng-repeat="t in getTiles() track by t.id" 
        type="{{t.type}}" x="{{t.x}}" y={{t.y}}
        tile-id="t.id" newbie="" on-swap="onSwap(move, x, y)"
        class="position-{{t.x}}-{{t.y}}" ng-class="getTileClass(t)">
    </tile>
    
    <span ng-repeat="s in getScoreBanners() track by s.id" class="score" ng-class="getScoreBannerClass(s)">{{s.value}}</span>
    `,
    bindings: { onScoreIncreased: '&' /* Score have been increaced */ },
    controllerAs: '$',
    controller: ['$scope', function($scope) {
        // Game grid
        $scope.grid = [];
        // Possible swaps for the current filled grid
        $scope.possibleSwaps = [];
        $scope.level = null;

        // View helper methods
        $scope.getTileClass = (t) => {
            let tileClass = ''; 
            tileClass +=  t.removed === true ? ' remove' : '';
            tileClass +=  t.newbie === true ? ' newbie' : '';
            return tileClass;
        };

        $scope.getScoreBannerClass = (s) => {
            return `position-${s.x}-${s.y}`;
        };

        // Generate tiles global index
        $scope.index = 0;
        $scope.scoreIndex = 0;
        $scope.playgroundLocked = false;

        // Score variables
        $scope.xBonus = 0; 
        $scope.scoreBanners = [];

        $scope.$parent.generateLevel = (level) => {
            if ($scope.level !== null) {
                resetGrid();
                return;
            }

            $scope.level = level;
            createTiles();
        };

        // Create tiles
        let createTiles = () => {
            $scope.playgroundLocked = true;

            let grid = $scope.grid, tileType, firstTime = false;
            let level = $scope.level;

            if (grid.length <= 0) {
                firstTime = true;
            }

            if (!level.hasOwnProperty('tiles') || !angular.isArray(level.tiles)) {
                throw new Error(`Level configuration's damaged`);
            }

            if (level.tiles.length !== GRID_ROWS_COUNT || level.tiles[0].length !== GRID_ROWS_COUNT) {
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
                        id: $scope.index++,
                        type: tileType,
                        x: i,
                        y: j,
                        removed: false,
                        newbie: true
                    };
                }
            }
            
            // Perform 'show' animation
            setTimeout(() => {
                for(let i = 0; i < GRID_COLUMNS_COUNT; i++) {
                    for(let j = 0; j < GRID_ROWS_COUNT; j++) {
                        if (grid[i][j] !== null) {
                            grid[i][j].newbie = false;
                        }
                    }
                }

                $scope.grid = angular.copy(grid);
                $scope.$digest();

                $scope.playgroundLocked = false;

                // Detect all possible swaps
                detectPossibleSwaps();

                if ($scope.possibleSwaps.length <= 0) {
                    resetGrid();
                }
            }, 0);

            $scope.grid = angular.copy(grid);
            
            if (!firstTime) {
                $scope.$digest();
            }
        };

        let resetGrid = () => {
            $scope.playgroundLocked = true;
            let grid = $scope.grid, changedGrid = angular.copy(grid);
            for(let i = 0; i < GRID_COLUMNS_COUNT; i++) {
                for(let j = 0; j < GRID_ROWS_COUNT; j++) {
                    if (grid[i][j] !== null) {
                        grid[i][j].removed = true;
                        changedGrid[i][j] = null;
                    }
                }
            }

            // Remove items after animation ends
            setTimeout(() => {
                $scope.grid = changedGrid;
                $scope.$digest();
                // Create tiles again
                createTiles();
            }, REMOVE_ANIMATION_DURATION);

            $scope.grid = angular.copy(grid);
        };

        // Helper function to detect swaps
        let hasChainAtColumn = (grid, column, row) => {
            let tileType = grid[column][row].type;

            let horzLength = 1;
            for (let i = column - 1; i >= 0 && grid[i][row] !== null && grid[i][row].type === tileType; i--, horzLength++) ;
            for (let i = column + 1; i < GRID_COLUMNS_COUNT && grid[i][row] !== null && grid[i][row].type == tileType; i++, horzLength++) ;
            if (horzLength >= 3) {
                return true;   
            }

            let vertLength = 1;
            for (let i = row - 1; i >= 0 && grid[column][i] !== null && grid[column][i].type == tileType; i--, vertLength++) ;
            for (let i = row + 1; i < GRID_ROWS_COUNT && grid[column][i] !== null && grid[column][i].type == tileType; i++, vertLength++) ;
            
            return (vertLength >= 3);
        };

        // Detect possible swaps
        let detectPossibleSwaps = () => {
            let grid = angular.copy($scope.grid);
            let swaps = [];

            for (let i = 0; i < GRID_COLUMNS_COUNT; i++) {
                for (let j = 0; j < GRID_ROWS_COUNT; j++) {

                    let tile = grid[i][j];
                    if (tile != null) {
                        // Is it possible to swap this cookie with the one on the right?
                        if (i < GRID_COLUMNS_COUNT - 1) {
                            // Have a cookie in this spot? If there is no tile, there is no cookie.
                            let other = grid[i + 1][j];
                            if (other !== null) {                                     
                                // Swap them
                                grid[i][j] = other;
                                grid[i + 1][j] = tile;
                            
                                // Is either cookie now part of a chain?
                                if (hasChainAtColumn(grid, i + 1, j) || hasChainAtColumn(grid, i, j)) {
                                    swaps.push([tile.id, other.id]);
                                }
                            
                                // Swap them back
                                grid[i][j] = tile;
                                grid[i + 1][j] = other;
                            }
                        }

                        if (j < GRID_ROWS_COUNT - 1) {
                            let other = grid[i][j + 1];
                            if (other !== null) {
                            
                                // Swap them
                                grid[i][j] = other;
                                grid[i][j + 1] = tile;

                                if (hasChainAtColumn(grid, i, j + 1) || hasChainAtColumn(grid, i, j)) {
                                    swaps.push([tile.id, other.id]);
                                }
                        
                                grid[i][j] = tile;
                                grid[i][j + 1] = other;
                            }   
                        }
                    }
                }
            }

            $scope.possibleSwaps = swaps;
        };

        // Check two elements for swap
        let checkForSwap = (a, b) => {
            if (a === null || b === null) {
                return false;
            }

            let swaps = $scope.possibleSwaps;
            for (let i = 0; i < swaps.length; i++) {
                if (swaps[i][0] === a.id && swaps[i][1] === b.id ||
                    swaps[i][0] === b.id && swaps[i][1] === a.id) {
                    return true;
                }
            }

            return false;
        };

        let detectHorizontalMatches = () => {
            let set = [], grid = $scope.grid;

            for (let j = 0; j < GRID_ROWS_COUNT; j++) {
                for (let i = 0; i < GRID_COLUMNS_COUNT - 2; ) {

                    if (grid[i][j] !== null) {
                        let matchType = grid[i][j].type;

                        if (grid[i + 1][j] !== null && grid[i + 1][j].type == matchType &&
                            grid[i + 2][j] !== null && grid[i + 2][j].type == matchType) {
                    
                            let chain = [];
                            do {
                                chain.push(grid[i][j]);
                                i++;
                            } while (i < GRID_COLUMNS_COUNT && grid[i][j] !== null && grid[i][j].type == matchType);
            
                            set.push(chain);
                            continue;
                        }
                    }

                    i++;
                }
            }

            return set;
        };

        let detectVerticalMatches = () => {
            let set = [], grid = $scope.grid;

            for (let i = 0; i < GRID_COLUMNS_COUNT; i++) {
                for (let j = 0; j < GRID_ROWS_COUNT - 2; ) {
                    if (grid[i][j] !== null) {
                        let matchType = grid[i][j].type;

                        if (grid[i][j + 1] !== null && grid[i][j + 1].type == matchType &&
                            grid[i][j + 2] !== null && grid[i][j + 2].type == matchType) {
                    
                            let chain = [];
                            do {
                                chain.push(grid[i][j]);
                                j++;
                            } while (j < GRID_ROWS_COUNT && grid[i][j] !== null && grid[i][j].type == matchType);
            
                            set.push(chain);
                            continue;
                        }
                    }

                    j++;
                }
            }

            return set;
        };

        // Remove tiles from grid
        let removeTiles = (matches) => {
            let grid = $scope.grid, changedGrid = angular.copy(grid);
            return new Promise(removed => {
                for (let i = 0; i < matches.length; i++) {
                    // Perform animations
                    for (let j = 0; j < matches[i].length; j++) {
                        let tile = matches[i][j], x = tile.x, y = tile.y;

                        grid[x][y].removed = true;
                        // Actually remove items
                        changedGrid[x][y] = null;
                    }
                }

                // Remove items after animation ends
                setTimeout(() => {
                    $scope.grid = changedGrid;
                    $scope.$digest();
                    removed();
                }, REMOVE_ANIMATION_DURATION);

                $scope.grid = angular.copy(grid);
                $scope.$digest(); 
            });
        };

        // Helper function to shiftExistingTiles
        let findTileAbove = (column, row, shouldSkip) => {
            let skipped = 0;
            if ($scope.grid[column][row] !== null) {
                if (skipped >= shouldSkip) {
                    return $scope.grid[column][row];
                }

                skipped++;
            }

            for (let j = row - 1; j >= 0; j--) {
                if ($scope.grid[column][j] !== null) {
                    if (skipped >= shouldSkip) {
                        return $scope.grid[column][j];
                    }

                    skipped++;
                }
            }

            return false;
        };

        // Shift tiles down to fill holes after removing
        let shiftTiles = () => {
            return new Promise(shifted => {
                let tileAbove, grid = $scope.grid, changedGrid = angular.copy(grid), level = $scope.level.tiles;

                for (let i = 0; i < GRID_COLUMNS_COUNT; i++) {
                    let row = GRID_ROWS_COUNT - 1, skipped = 0;

                    while (row > 0 && level[i][row] === 0) {
                        row--;
                    }

                    while (row >= 0 && (tileAbove = findTileAbove(i, row, skipped)) !== false) {

                        // Perform animations
                        // console.log(i, row, tileAbove, skipped);
                        let x = tileAbove.x, y = tileAbove.y;
                        grid[x][y].x = i;
                        grid[x][y].y = row;

                        // Add skip if it was removed element
                        if (grid[i][row] === null) {
                            skipped++;
                        }

                        if (row !== y) {
                            changedGrid[i][row] = grid[x][y];
                            changedGrid[x][y] = null;
                        }

                        while (row > 0 && level[i][row - 1] === 0) {
                            row--;
                        }

                        row--;
                    }
                }

                // Actually move items
                shifted(changedGrid); 

                $scope.grid = angular.copy(grid);
                $scope.$digest();
            });
        };

        let fillHoles = (grid) => {
            return new Promise(filled => {
                let changesMap = [], tileType;
                let level = $scope.level;

                for(let i = 0; i < GRID_COLUMNS_COUNT; i++) {
                    for(let j = 0; j < GRID_ROWS_COUNT; j++) {
                        // Check if we have tile from level configuration or tile already exists
                        if (level.tiles[i][j] === 0 || grid[i][j] !== null) {
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
                            id: $scope.index++,
                            type: tileType,
                            x: i,
                            y: j,
                            removed: false,
                            newbie: true
                        };

                        changesMap.push({ x: i, y: j });
                    }
                }

                $scope.grid = angular.copy(grid);
                $scope.$digest();

                setTimeout(() => {
                    // Perform falling animations to the newbies
                    for (let i = 0; i < changesMap.length; i++) {
                        grid[changesMap[i].x][changesMap[i].y].newbie = false;
                    }

                    // Wait animation end
                    setTimeout(() => { filled(); }, SWAP_ANIMATION_DURATION);

                    $scope.grid = angular.copy(grid);
                    $scope.$digest();
                }, 0);
            });
        };

        let startMatchDetectingCycle = () => {
            // Detect elements to remove
            let matches = [...detectVerticalMatches(), ...detectHorizontalMatches()];
            if (matches.length > 0) {
                let iterationScoreBanners = [];

                // Increase score
                for (let i = 0; i < matches.length; i++) {
                    // Default cost
                    let score = CHAIN_REMOVE_COST;
                    // Add chain length bonus
                    score += (matches[i].length - 3) * CHAIN_LENGTH_BONUS;
                    // Multiply to X Bonus
                    score = score * ($scope.xBonus + 1);

                    let matchLengthMid = Math.floor(matches[i].length / 2);
                    let scoreBannerID = $scope.scoreIndex++;
                    $scope.scoreBanners.push({
                        id: scoreBannerID,
                        value: score,
                        x: matches[i][matchLengthMid].x,
                        y: matches[i][matchLengthMid].y,
                    });
                    // Push index 
                    iterationScoreBanners.push(scoreBannerID);
                    this.onScoreIncreased({ value: score });
                }

                // Remove animation
                setTimeout(() => {
                    // Remove not used score banners
                    for (let i = 0; i < $scope.scoreBanners.length; i++) {
                        let bannersIDs = iterationScoreBanners;
                        for (let j = 0; j < bannersIDs.length; j++) {
                            if ($scope.scoreBanners[i] !== null && bannersIDs[j] === $scope.scoreBanners[i].id) {
                                $scope.scoreBanners[i] = null;
                            }
                        }
                    }
                    $scope.$digest();
                }, SCORE_ANIMATION_DURATION);

                // Remove them
                removeTiles(matches).then(() => {
                    // Shift tiles to fill holes down
                    shiftTiles().then(changedGrid => {
                        // Fill holes up
                        fillHoles(changedGrid).then(() => {
                            // Increase X Bonus each cycle
                            $scope.xBonus += 0.5;
                            startMatchDetectingCycle();                        
                        });
                    });
                });

            // Nothing to remove, just pass
            } else {
                // Reset X Bonus
                $scope.xBonus = 0;
                
                detectPossibleSwaps();
                // Reset grid if there's no more swaps
                if ($scope.possibleSwaps.length <= 0) {
                    resetGrid();
                } else {
                    $scope.$digest();
                    // Enable playground
                    $scope.playgroundLocked = false;
                }
            }
        };

        // Get current filled grid as a one-dimensional array
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

        $scope.getScoreBanners = () => {
            let banners = [];
            for (let i = 0; i < $scope.scoreBanners.length; i++) {
                if ($scope.scoreBanners[i] !== null) {
                    banners.push($scope.scoreBanners[i]);
                }
            }

            return banners;
        };

        // Watch grid for changes
        $scope.$watch('grid');
        $scope.$watch('scoreBanners');

        // Swap event fired, change tiles positions
        $scope.onSwap = (move, x, y) => {
            // Whoops! Last cycle not finished yet
            if ($scope.playgroundLocked === true) {
                return;
            }

            // Lock playground
            $scope.playgroundLocked = true;

            let grid = $scope.grid, pulledXY = null;

            // Convert coordinates into numbers
            x = parseInt(x, 10);
            y = parseInt(y, 10);

            // Choose pulled element
            switch(move) {
            case 0: // Right
                pulledXY = (x + 1 < GRID_COLUMNS_COUNT && grid[x + 1][y] !== null) ? { x: x + 1, y: y } : null;
                break;
            case 1: // Left
                pulledXY = (x - 1 >= 0 && grid[x - 1][y] !== null) ? { x: x - 1, y: y } : null;
                break;
            case 2: // Up
                pulledXY = (y + 1 < GRID_ROWS_COUNT && grid[x][y + 1] !== null) ? { x: x, y: y + 1 } : null;
                break;
            case 3: // Down
                pulledXY = (y - 1 >= 0 && grid[x][y - 1] !== null) ? { x: x, y: y - 1 } : null;
                break;
            }
            
            // Cancel if it's impossible move
            if (pulledXY === null) {
                return;
            }

            let _x = pulledXY.x, _y = pulledXY.y;
            let pushed = grid[x][y], pulled = grid[_x][_y];

            pushed.x = _x;
            pushed.y = _y;

            pulled.x = x;
            pulled.y = y;

            // Wait swap animation end
            setTimeout(() => {
                // Check for actual swap
                if (checkForSwap(pushed, pulled)) {
                    // Save swap
                    grid[x][y] = pulled;
                    grid[_x][_y] = pushed;

                    $scope.grid = angular.copy(grid);
                    
                    // Detect matches and remove them
                    startMatchDetectingCycle();
                // Or decline changes
                } else {
                    pushed.x = x;
                    pushed.y = y;

                    pulled.x = _x;
                    pulled.y = _y;
                    
                    $scope.grid = angular.copy(grid);
                    $scope.$digest();

                    // Enable playground
                    $scope.playgroundLocked = false;           
                }

            }, SWAP_ANIMATION_DURATION);

            $scope.grid = angular.copy(grid);
            $scope.$digest();  
        };
    }]
};