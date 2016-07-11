'use strict';

const SIGNS_SVG = [
    require('./../../images/signs/0.svg')
];

export default {
    template: `
        Иконка:
        ${SIGNS_SVG[0]}
    `,
    controller: () => {
        console.log('DSA');
    }
};