/*jslint browser: true*/
/*global $, jQuery, alert*/


/*
$(document).ready(function () {

    $(window).scroll(function () {
        var currentY = $(this).scrollTop();
        var pageStart = $("#page-content").offset().top;
        var calculated = false;
        if (currentY >= pageStart) {
        	if(!calculated){
        		$('#logo-pic').height($('nav').outerHeight());
    			$('#logo-pic').width($('nav').outerHeight());
    			calculated = true;
        	}
            $('#header-logo').hide(500);
            $('#logo-pic').show(500);
        } else if (pageStart == null){
        	$('#logo-pic').height($('nav').outerHeight());
    		$('#logo-pic').width($('nav').outerHeight());
        } else {
            $('#header-logo').show(500);
            $('#logo-pic').hide(500);
        }
    });
});
*/



$(document).ready(function () {
    'use strict';
    var animated = false;
    var width = $(window).width();
    var isMobile = false;

    if (width < 600) {
        isMobile = true;
    }
    $('#percentage-stat').addClass('hide-me-keep-space');   
});



//Code for switching views is awful - REVISIT
$(document).ready(function () {
    'use strict';
    $('#d-desktop-button').click(function () {
        $("#desktop-size").show(300, function () {});
        $("#mobile-size").hide(300, function () {});
        $("#tablet-size").hide(300, function () {});
    });
    $('#t-desktop-button').click(function () {
        $("#desktop-size").show(300, function () {});
        $("#mobile-size").hide(300, function () {});
        $("#tablet-size").hide(300, function () {});
    });
    $('#m-desktop-button').click(function () {
        $("#desktop-size").show(300, function () {});
        $("#mobile-size").hide(300, function () {});
        $("#tablet-size").hide(300, function () {});
    });


    $('#d-tablet-button').click(function () {
        $("#tablet-size").show(300, function () {});
        $("#mobile-size").hide(300, function () {});
        $("#desktop-size").hide(300, function () {});
    });
    $('#t-tablet-button').click(function () {
        $("#tablet-size").show(300, function () {});
        $("#mobile-size").hide(300, function () {});
        $("#desktop-size").hide(300, function () {});
    });
    $('#m-tablet-button').click(function () {
        $("#tablet-size").show(300, function () {});
        $("#mobile-size").hide(300, function () {});
        $("#desktop-size").hide(300, function () {});
    });


    $('#d-mobile-button').click(function () {
        $("#mobile-size").show(300, function () {});
        $("#desktop-size").hide(300, function () {});
        $("#tablet-size").hide(300, function () {});
    });
    $('#t-mobile-button').click(function () {
        $("#mobile-size").show(300, function () {});
        $("#desktop-size").hide(300, function () {});
        $("#tablet-size").hide(300, function () {});
    });
    $('#m-mobile-button').click(function () {
        $("#mobile-size").show(300, function () {});
        $("#desktop-size").hide(300, function () {});
        $("#tablet-size").hide(300, function () {});
    });
});


$(document).ready(function () {
    var heights = $(".equal-height").map(function () {
            return $(this).height();
        }).get(),

        maxHeight = Math.max.apply(null, heights);

    $(".equal-height").height(maxHeight);
});

$(document).ready(function () {
     var canvasWidth = $('#canvas-container').width();
    $('#game-of-life-canvas').width(canvasWidth);
});
