/**
* @fileOverview
* @author Zoltan Toth
* @version 1.0.0
*/

/**
* @description
* A vanilla JavaScript weather widget.
*/
export default class Weather {
    constructor(options) {
        this.element = document.getElementById(options.container || 'weather');
    }

}