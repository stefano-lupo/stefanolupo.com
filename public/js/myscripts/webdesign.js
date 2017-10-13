$(document).ready(function() {

$(window).scroll(function () {
  var currentY = $(this).scrollTop();
  var mobileFirst = $("#mobile-first").offset().top;
  var solution = $("#solution").offset().top;
  var mobileStartLoc = $("#non-mobile-friendly-mobile-start-animation").offset().top;
  var animated = false;
  var width = $(window).width();
  var isMobile = false;

  if (width < 600) {
    isMobile = true;
  }

  $('#percentage-stat').addClass('hide-me-keep-space');
        if (!isMobile) {

            if ((animated === false) && (currentY >= mobileFirst) && (currentY <= solution)) {
                $('#percentage-stat').removeClass('hide-me-keep-space');
                $('.count').each(function () {
                    $(this).prop('Counter', 0).animate({
                        Counter: $(this).text()
                    }, {
                        duration: 4000,
                        easing: 'swing',
                        step: function (now) {
                            $(this).text(Math.ceil(now));
                        }
                    });
                });
                animated = true;
            }
        } else {
            if ((animated === false) && (currentY >= (mobileStartLoc - 600)) && (currentY <= solution)) {
                $('#percentage-stat').removeClass('hide-me-keep-space');
                $('.count').each(function () {
                    $(this).prop('Counter', 0).animate({
                        Counter: $(this).text()
                    }, {
                        duration: 4000,
                        easing: 'swing',
                        step: function (now) {
                            $(this).text(Math.ceil(now));
                        }
                    });
                });
                animated = true;
            }
        }

    });
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


