/* global console ,$ */
$(function(){

    'use strict';
    var hei = $(window).innerHeight();
    console.log(hei);
    $('.chat-list').height(hei - $('.navbar').innerHeight());
});