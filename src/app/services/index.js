'use strict';

import angular from 'angular';

export default () => {

    let app = angular.module('app');

    app.factory('ModalData', function () {
        return {
            message: null,
            score: null,
            targetScore: null,
            totalScore: null
        };
    });

    app.factory('ResultModal', function (btfModal) {
        return btfModal({
            controller: 'ModalController',
            controllerAs: '$modal',
            template: `
                <div class="modal-wrapper">
                    <div class="modal-window">
                        <span class="header center">{{game.message}}</span>
                        <p class="center"><b>Goal:</b> {{getDelimitedNumber(game.targetScore)}}</p>
                        <p class="center"><b>Your score:</b> {{getDelimitedNumber(game.score)}}</p>
                        <p class="center"><span class="subheader">Total score: {{getDelimitedNumber(game.totalScore)}}</span></p>
                        <p class="indent center">
                            <span class="button center" ng-click="$modal.continue()">
                                <span ng-show="game.targetScore <= game.score">Continue</span>
                                <span ng-show="game.targetScore > game.score">Try again</span>
                            </span>
                        </p>
                    </div>
                </div>
            `
        });
    });
};