
$(document).ready(function() {
	$('form#newClient').submit(function(e) {
		var filled = true;
		var i = 0;
		var values = [];

		$(this).find('input').each(function() {
			if (($(this).val() == "") || ($(this).val() == null)) {
				$(this).css("background-color", "red");
				filled = false;
			} else {
				values[i] = $(this).val();
				i++
			}
		});

		if (!filled) {
			e.preventDefault();
			i=0;
		}

	});
});

