
function animateToValue(element, value) {
  $({dummy: 0}).animate(
    {dummy: 1},
    {
      step: (now, fx) => {
        $(element).text(Math.ceil(now * value));
      },
      duration: 5000,
      start: () => console.log("Started animating for " + value),
      done: () =>console.log("Done for " + value)
    })
}

$(document).ready(function() {
  
  var animationStarted = false;

  function startAnimation() {
    $('.count').each((index, element) => {
      $(element).removeClass("hide-me-keep-space");
      var finalValue = $(element).text();
      animateToValue(element, finalValue);
    });
  }

  $(window).scroll(function () {
    if (!animationStarted) {
      var currentY = $(this).scrollTop();
      var mobileFirst = $("#mobile-first").offset().top;
      var solution = $("#solution").offset().top;
      var mobileStartLoc = $("#non-mobile-friendly-mobile-start-animation").offset().top
      
      // Desktop
      if (!$(window).width() > 600) {
        if (currentY >= mobileFirst && currentY <= solution) {
          startAnimation();
          animationStarted = true;
        }
      } else {
        if (currentY >= (mobileStartLoc - 600) && (currentY <= solution)) {
          startAnimation();
          animationStarted = true;
        }
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


