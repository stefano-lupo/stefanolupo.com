$(document).ready(function() {

$(window).scroll(function () {
        var currentY = $(this).scrollTop();
        var mobileFirst = $("#mobile-first").offset().top;
        var solution = $("#solution").offset().top;
        var mobileStartLoc = $("#non-mobile-friendly-mobile-start-animation").offset().top;

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