(function($) {
	"use strict";

	$(document).ready(function() {

		if (!($('#page-content').length)) {
			$('#logo-pic').height($('nav').outerHeight());
			$('#logo-pic').width($('nav').outerHeight());
			$('#logo-pic').show(500);
		}
		$(window).scroll(function() {
			if ($('#page-content').length) {
				var currentY = $(this).scrollTop();
				var pageStart = $("#page-content").offset().top;
				var calculated = false;
				if (currentY >= pageStart) {
					if (!calculated) {
						$('#logo-pic').height($('nav').outerHeight());
						$('#logo-pic').width($('nav').outerHeight());
						calculated = true;
					}
					$('#header-logo').hide(500);
					$('#logo-pic').show(500);
				} else {
					$('#header-logo').show(500);
					$('#logo-pic').hide(500);
				}
			}
		});

	});

	//  jQuery for page scrolling feature - requires jQuery Easing plugin
	$('a.page-scroll').bind('click', function(event) {
		var $anchor = $(this);
		$('html, body').stop().animate({
			scrollTop : ($($anchor.attr('href')).offset().top - 80)
		}, 1250, 'easeInOutExpo');
		event.preventDefault();
	});

	//  Coordinates of page start
	if ($('#page-content')[0] !== undefined) {
		var offsetNav = $('#page-content').offset().top;
	} else {
		var offsetNav = 0;
		$('body').css("padding-top", "40px");
	}

	//  Offset for Main Navigation
	$('#main-nav').affix({
		offset : {
			top : offsetNav - 100
		}
	})

	/*  Highlight the top nav as scrolling occurs
	 $('body').scrollspy({
	 target: '.navbar-fixed-top',
	 offset: offsetNav - 100
	 });

	 */

	/*  Closes the Responsive Menu on Menu Item Click
	 But first check if its a dropdown list -- if it is dont close menu */
	$('.navbar-collapse ul li a').click(function() {
		var caller = $(event.target);
		if (!caller.hasClass('dropdown-toggle')) {
			$('.navbar-toggle:visible').click();
		}
	});

	//  Animate Burger
	$(".navbar-toggle").on("click", function() {
		$(this).toggleClass("active");
	});

	//  Testimonials
	var divs = $('.testimonial').hide(),
	    i = 0;

	(function cycle() {

		divs.eq(i).fadeIn(800).delay(8000).fadeOut(800, cycle);

		i = ++i % divs.length;

	})();

	// Initialize WOW.js Scrolling Animations
	new WOW().init();

})(jQuery);
// End of use strict
