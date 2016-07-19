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
        // Stop game
        if ($scope.gameStarted === true) {
            $scope.gameStarted = false;

            // End level if needed
            if ($scope.startLevel === true) {
                $scope.startLevel();
            }
        // Start game
        } else {
            $scope.gameStarted = true;

            $scope.totalScore = 0;            
            $scope.loadLevel(LEVELS[0]);
        }
    };

    $scope.loadLevel = (level) => {
        $scope.level = level;

        $scope.score = 0;

        $scope.timer = null;
        $scope.timeLeft = level.time * 1000;
    };

    $scope.startLevel = (level) => {
        // Stop level
        if ($scope.levelStarted === true) {
            $scope.levelStarted = false;

            if ($scope.totalScore > 0 && $scope.score > 0) {
                $scope.totalScore -= $scope.score;
            }
        // Start level
        } else {
            $scope.levelStarted = true;

            $scope.loadLevel(level);
            $scope.generateLevel(level);

            // $scope.timer = setInterval(() => {

            // });
        }
    };

    $scope.increaseScore = (value) => {
        $scope.totalScore += value;
        $scope.score += value;
        $scope.$digest();
    };

    $scope.$watch('totalScore');
    $scope.$watch('score');

}];