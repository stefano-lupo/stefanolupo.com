/*jslint browser: true*/
/*global $, jQuery, alert*/
$(document).ready(function () {
    'use strict';

    //  Add fade in transitions if touch screen device -- otherwise hover is used
    var width = $(window).width();
    if (width < 1280) {
        $('.portfolio-box-caption').addClass('wow fadeIn');

    }

    $('#lp-design-link').click(function () {
        $('.portfolio-thumb-divs').removeClass('hide-me');
        $('.portfolio-content').hide("slow");
        $('#lp-design').show("slow");
        $('.portfolio-thumb-divs').removeClass('col-sm-6');
        $('#original-row').removeClass('row no-gutter');
        $('#original-row-2').removeClass('row no-gutter');
        $('#unused-row').addClass('row no-gutter');
        $('.portfolio-thumb-divs').addClass('col-sm-4');
        $(this).addClass('hide-me');
        $('html, body').animate({
            scrollTop: $("#scroll-here").offset().top - 80
        }, 1000);

    });

    $('#phil-design-link').click(function () {
        $('.portfolio-thumb-divs').removeClass('hide-me');
        $('.portfolio-content').hide("slow");
        $('#phil-design').show("slow");
        $('.portfolio-thumb-divs').removeClass('col-sm-6');
        $('.portfolio-thumb-divs').addClass('col-sm-4');
        $('#original-row').removeClass('row no-gutter');
        $('#original-row-2').removeClass('row no-gutter');
        $('#unused-row').addClass('row no-gutter');
        $(this).addClass('hide-me');
        $('html, body').animate({
            scrollTop: $("#scroll-here").offset().top - 80
        }, 1000);
    });

    $('#sweeneyprogolf-link').click(function () {
        $('.portfolio-thumb-divs').removeClass('hide-me');
        $('.portfolio-content').hide("slow");
        $('#sweeneyprogolf').show("slow");
        $('.portfolio-thumb-divs').removeClass('col-sm-6');
        $('.portfolio-thumb-divs').addClass('col-sm-4');
        $('#original-row').removeClass('row no-gutter');
        $('#original-row-2').removeClass('row no-gutter');
        $('#unused-row').addClass('row no-gutter');
        $(this).addClass('hide-me');
        $(this).addClass('hide-me');
        $('html, body').animate({
            scrollTop: $("#scroll-here").offset().top - 80
        }, 500);
    });

    $('#westbury-link').click(function () {
        $('.portfolio-thumb-divs').removeClass('hide-me');
        $('.portfolio-content').hide("slow");
        $('#westbury').show("slow");
        $('.portfolio-thumb-divs').removeClass('col-sm-6');
        $('.portfolio-thumb-divs').addClass('col-sm-4');
        $('#original-row').removeClass('row no-gutter');
        $('#original-row-2').removeClass('row no-gutter');
        $('#unused-row').addClass('row no-gutter');
        $(this).addClass('hide-me');
        $(this).addClass('hide-me');
        $('html, body').animate({
            scrollTop: $("#scroll-here").offset().top - 80
        }, 1000);
    });
});
