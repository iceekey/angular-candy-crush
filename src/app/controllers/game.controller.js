'use strict';

// Game Controller
export default ['$scope', function($scope) {
    $scope.startGame = () => {
        $scope.createTiles();
    };
}];