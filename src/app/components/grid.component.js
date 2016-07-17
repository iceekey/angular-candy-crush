'use strict';

// Grid Compoenent
export default {
    template: `<tile type="3"></tile>`,
    controllerAs: '$',
    controller: ['$scope', function($scope) {
        $scope.$parent.createCookies = () => {
            console.log('HELLO');    
        };
    }]
};