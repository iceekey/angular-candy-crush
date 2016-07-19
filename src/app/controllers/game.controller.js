'use strict';

import {LEVELS} from './../config';

// Game Controller
export default ['$scope', function($scope) {
    
    $scope.gameStarted = false;
    $scope.levelStarted = false;

    // Game total score
    $scope.totalScore = 0;
    // Currect level score
    $scope.score = 0;

    // Currect level time left
    $scope.timeLeft = null;
    // Currect level timer
    $scope.timer = null;

    // Currect level
    $scope.level = null;

    $scope.startGame = () => {
        $scope.gameStarted = !$scope.gameStarted;
        $scope.totalScore = 0;
        $scope.loadLevel(LEVELS[0]);
    };

    $scope.loadLevel = (level) => {
        $scope.level = level;
    };

    $scope.startLevel = (level) => {
        if ($scope.totalScore > 0 && $scope.score > 0) {
            $scope.totalScore -= $scope.score;
        }

        $scope.score = 0;
        $scope.timeLeft = null;
        $scope.timer = null;

        $scope.levelStarted = true;

        $scope.loadLevel(level);
        $scope.generateLevel(level);
    };

    $scope.increaseScore = (value) => {
        $scope.totalScore += value;
        $scope.score += value;
        $scope.$digest();
    };

    $scope.$watch('totalScore');
    $scope.$watch('score');

}];