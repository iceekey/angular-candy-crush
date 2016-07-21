'use strict';

import {LEVELS, LEVELS_COUNT, POP_MESSAGE_ANIMATION_DURATION} from './../config';

// Game Controller
export default ['$scope', 'ResultModal', function($scope, $modal) {
    
    $scope.gameStarted = false;
    $scope.gameFinished = false;

    $scope.levelStarted = false;
    $scope.levelFinished = false;

    // Game total score
    $scope.totalScore = 0;
    // Currect level score
    $scope.score = 0;

    // Currect level time left
    $scope.timeLeft = null;
    // Currect level timer
    $scope.timer = null;

    // Currect level
    $scope.popMessage = null;

    $scope.level = null;
    $scope.levelNum = 0;

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
            $scope.gameFinished = false;

            $scope.totalScore = 0;   
            $scope.levelNum = 0;         
            $scope.loadLevel(LEVELS[$scope.levelNum]);
        }
    };

    $scope.loadLevel = (level) => {
        if (!level.hasOwnProperty('targetScore') || !level.hasOwnProperty('time')) {
            throw new Error(`Level configuration's damaged`);
        }
        
        $scope.level = level;
        $scope.score = 0;

        $scope.timer = null;
        $scope.timeLeft = level.time * 1000;
        $modal.activate();
    };

    $scope.startLevel = (level) => {
        // Stop level
        if ($scope.levelStarted === true) {
            $scope.levelStarted = false;
            $scope.levelFinished = false;

            clearInterval($scope.timer);

            if ($scope.totalScore > 0 && $scope.score > 0) {
                $scope.totalScore -= $scope.score;
            }
        // Start level
        } else {
            $scope.levelStarted = true;
            $scope.levelFinished = false;

            $scope.loadLevel(level);
            $scope.generateLevel(level);

            $scope.timer = setInterval(() => {
                $scope.timeLeft -= 1000;

                if ($scope.timeLeft <= 0) {
                    $scope.timeLeft = 0;
                    clearInterval($scope.timer);

                    $scope.levelStarted = false;
                    $scope.levelFinished = true;
                    $scope.clearGrid();

                    if ($scope.score >= $scope.level.targetScore) {
                        if ($scope.levelNum + 1 === LEVELS_COUNT) {
                            $scope.popMessage = `You won the game. Congratulations!`;
                        } else {
                            $scope.popMessage = `Level is completed successfully!`;
                        }
                    } else {
                        $scope.popMessage = `Oops... not enough points. Try again.`;
                    }

                    setTimeout(function() {
                        $scope.popMessage = null;
                        $scope.$digest();
                    }, POP_MESSAGE_ANIMATION_DURATION);
                }
                $scope.$digest();
            }, 1000);
        }
    };

    $scope.increaseScore = (value) => {
        $scope.totalScore += value;
        $scope.score += value;
        $scope.$digest();
    };

    // Helper function to show time
    $scope.getHumanTime = (time) => {
        let sign = 1;
        
        if (time < 0) {
            sign *= (-1);
        }

        time = Math.abs(time);

        let result = (sign > 0) ? '' : '- ';

        let seconds = Math.floor(time / 1000);
        let mins = Math.floor(seconds / 60);
        let hours = Math.floor(mins / 60);

        if (hours > 0) {
            result += hours.toString() + ' ч. ';
        }


        mins = mins - hours * 60;
        if (mins > 0) {
            result += mins.toString() + ' мин. ';
        }

        seconds = seconds - hours * 3600 - mins * 60;
        if (seconds > 0)  {
            result += seconds.toString() + ' сек.';
        }

        return result;
    };

    $scope.getTimeLeftPercent = () => {
        return Math.floor($scope.timeLeft / $scope.level.time);
    };

    $scope.$watch('timeLeft');
    $scope.$watch('totalScore');
    $scope.$watch('score');
}];