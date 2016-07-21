'use strict';

// Modal Controller
export default ['$scope', 'ResultModal', function($scope, $modal) {
    this.closeMe = $modal.deactivate;

    $scope.name = 'John';
}];