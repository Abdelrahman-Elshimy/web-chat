/* global console ,$ */
$(function(){

    'use strict';
    var hei = $(window).innerHeight();
    $('.chat-list').innerHeight(hei - $('.navbar').innerHeight());
});