'use-strict';
import angular from 'angular';

import Level0 from './levels/level-01.json';
import Level1 from './levels/level-02.json';
import Level2 from './levels/level-03.json';

// Configuration

// Warning! You should also change variblea $grid-columns-count and $grid-rows-count in SCSS styles
export const GRID_COLUMNS_COUNT = 9;
export const GRID_ROWS_COUNT = 9;

// We could use 'animationend' event, but we're looking for better browsers support
// You sould change transition duration in SCSS styles if you want to change this
export const SWAP_ANIMATION_DURATION = 250;
export const REMOVE_ANIMATION_DURATION = 550;
export const SCORE_ANIMATION_DURATION = 800;

export const LEVELS = [angular.fromJson(Level0), angular.fromJson(Level1), angular.fromJson(Level2)];
export const LEVELS_COUNT = 3;

export const CHAIN_REMOVE_COST = 10000;
export const CHAIN_LENGTH_BONUS = 4000;