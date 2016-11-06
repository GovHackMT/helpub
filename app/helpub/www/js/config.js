/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var ConfigPage = function (page) {

    var thiz = this;
    thiz.page = page;

    this.back = function (cb) {
    }


    this.getEl = function (selector) {
        return thiz.page.find(selector);
    }

    this.init = function () {
    }
};
