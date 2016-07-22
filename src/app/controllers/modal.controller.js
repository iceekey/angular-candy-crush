'use strict';

// Modal Controller
export default ['$scope', 'ResultModal', 'ModalData', function($scope, $modal, $data) {
    this.continue = $modal.deactivate;
    $scope.game = $data;

    $scope.getDelimitedNumber = (n) => {
        return n.toString().replace(/./g, function(c, i, a) {
            return i && c !== '.' && ((a.length - i) % 3 === 0) ? ',' + c : c;
        });
    };
}];