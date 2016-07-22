'use strict';

import {LEVELS, LEVELS_COUNT} from './../config';

// Game Controller
export default ['$scope', 'ResultModal', 'ModalData', function($scope, $modal, $data) {
    
    $scope.gameStarted = false;
    $scope.gameFinished = false;

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

        $scope.timer = null;
        $scope.timeLeft = level.time * 1000;
    };

    $scope.goButtonLocked = false;
    $scope.startLevel = (level) => {
        if ($scope.goButtonLocked === true) {
            return;
        }

        // Stop level
        if ($scope.levelStarted === true) {
            $scope.goButtonLocked = true;
            $scope.levelStarted = false;

            clearInterval($scope.timer);

            $scope.clearGrid().then(() => {
                $scope.goButtonLocked = false;
                
                if ($scope.totalScore > 0 && $scope.score > 0) {
                    $scope.totalScore -= $scope.score;
                }
            });
        // Start level
        } else {
            $scope.levelStarted = true;

            $scope.loadLevel(level);
            $scope.generateLevel(level);

            $scope.timer = setInterval(() => {
                $scope.timeLeft -= 1000;

                if ($scope.timeLeft <= 0) {
                    clearInterval($scope.timer);

                    $scope.timer = null;
                    $scope.timeLeft = $scope.level.time;

                    $scope.levelStarted = false;
                    $scope.clearGrid().then(() => {
                        $data.score = $scope.score;
                        $data.targetScore = $scope.level.targetScore;
                        $data.totalScore = $scope.totalScore;

                        if ($scope.score >= $scope.level.targetScore) {
                            if ($scope.levelNum + 1 === LEVELS_COUNT) {
                                $data.message = `You won the game. Congratulations!`;
                                // Stop game
                                $scope.startGame();
                            } else {
                                $data.message = `Level's completed successfully!`;
                                $scope.loadLevel(LEVELS[++$scope.levelNum]);
                            }
                        } else {
                            $data.message = `Oops... not enough points.`;
                            $scope.totalScore -= $scope.score;
                            $data.totalScore = $scope.totalScore;
                        }

                        $scope.score = 0;
                        $modal.activate();
                    });
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
            result += hours.toString() + ' h. ';
        }

        mins = mins - hours * 60;
        if (mins > 0) {
            result += mins.toString() + ' m. ';
        }

        seconds = seconds - hours * 3600 - mins * 60;
        if (seconds > 0)  {
            result += seconds.toString() + ' s.';
        }

        return result;
    };

    $scope.getScorePercent = () => {
        return Math.floor(($scope.score / $scope.level.targetScore) * 100);
    };

    $scope.getDelimitedNumber = (n) => {
        return n.toString().replace(/./g, function(c, i, a) {
            return i && c !== '.' && ((a.length - i) % 3 === 0) ? ',' + c : c;
        });
    };

    $scope.$watch('timeLeft');
    $scope.$watch('totalScore');
    $scope.$watch('score');
}];