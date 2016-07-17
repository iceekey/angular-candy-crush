'use-strict';
import angular from 'angular';

import Level0 from './levels/level-01.json';

// Configuration

// Warning! You should also change variblea $grid-columns-count and $grid-rows-count in SCSS styles
export const GRID_COLUMNS_COUNT = 9;
export const GRID_ROWS_COUNT = 9;

export const LEVELS = [angular.fromJson(Level0)];