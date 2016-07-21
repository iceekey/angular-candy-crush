'use strict';

import angular from 'angular';

export default () => {

    let app = angular.module('app');

    app.factory('ResultModal', function (btfModal) {
        return btfModal({
            controller: 'ModalController',
            controllerAs: '$modal',
            template: `
                <div class="modal-wrapper">
                    <div class="modal-window">
                        <span class="header">Level is completed successfully!</span>
                        <p><b>Your score:</b> 122000</p>
                        <p><b>Total score:</b> 123342332</p>
                        <span class="button" ng-click="$modal.closeMe()">Continue</a>
                    </div>
                </div>
            `
        });
    });
};