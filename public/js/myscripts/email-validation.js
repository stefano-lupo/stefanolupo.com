$(document).ready(function() {

	$("form").submit(function() {
		var returnVal = true,
		    postArray = [];
		$('form').find('input, textarea').css('background-color', '#A2F99E');

		$('form input, form textarea').each(function() {
			if (($(this).val() == "") || ($(this).val() == null)) {
				$(this).css("background-color", "red");
				if (returnVal) {
					returnVal = false;
				}
			} else {
				var field = $(this).val().replace(/\r\n|\r|\n/g,"<br />");
				postArray.push(field);
			}

		});

		if (returnVal) {
			$.post("generic/send-mail.php", {
				posted : postArray,
			}, function() {
				$('#success').modal('show');
			});

			event.preventDefault();
		} else {
			return returnVal;
		}
	});
});
