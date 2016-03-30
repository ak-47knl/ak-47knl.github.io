/*
	Phantom by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Touch?
			if (skel.vars.touch)
				$body.addClass('is-touch');

		// Forms.
			var $form = $('form');

			// Auto-resizing textareas.
				$form.find('textarea').each(function() {

					var $this = $(this),
						$wrapper = $('<div class="textarea-wrapper"></div>'),
						$submits = $form.find('button[type="submit"]'),
						$button_text = $submits.text();

					$this
						.wrap($wrapper)
						.attr('rows', 1)
						.css('overflow', 'hidden')
						.css('resize', 'none')
						.on('keydown', function(event) {

							if (event.keyCode == 13 && (event.ctrlKey || event.metaKey)) {

								event.preventDefault();
								event.stopPropagation();

								$(this).blur();

								$form.submit();
							}

						})
						.on('focus', function() {
							var is_Mac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
							var append_text = ' (Ctrl + Enter)';
							if (is_Mac)
								append_text = ' (⌘ + Enter)';
							$submits.text($button_text + append_text);
						})
						.on('blur', function() {
							$submits.text($button_text);
						})
						.on('blur focus', function() {
							$this.val($.trim($this.val()));
						})
						.on('input blur focus --init', function() {

							$wrapper
								.css('height', $this.height());

							$this
								.css('height', 'auto')
								.css('height', $this.prop('scrollHeight') + 'px');

						})
						.on('keyup', function(event) {

							if (event.keyCode == 9)
								$this
									.select();

						})
						.triggerHandler('--init');

					// Fix.
						if (skel.vars.browser == 'ie'
						||	skel.vars.mobile)
							$this
								.css('max-height', '10em')
								.css('overflow-y', 'auto');

				});

			// Fix: Placeholder polyfill.
				$form.placeholder();

			// Submit form.
				$form.submit(function(e) {
					e.preventDefault();
					var _action 	= $(this).attr('action'),
						_name 		= $(this).find('#name').val(),
						_email 		= $(this).find('#email').val(),
						_message 	= $(this).find('#message').val();

					// Simple validation at client's end
					// We simple focus to empty field
					var proceed = true;
					if (_name == '') {
						$(this).find('#name').focus();
						proceed = false;
					}
					else if (_email == '') {
						$(this).find('#email').focus();
						proceed = false;
					}
					else if (_message == '') {
						$(this).find('#message').focus();
						proceed = false;
					}

					// Everything look good! proceed...
					if (proceed) {
						// Data to be send to server
						var _data = {
							'userName': _name,
							'userEmail': _email,
							'userMessage': _message
						};

						// Ajax post data to server
						$.ajax({
							type: 'POST',
							url: _action,
							crossDomain: false,
							data: _data,
							dataType: 'json',
							success: function(response) {
								console.log('Yo! Proceed...');
								if (response.type == 'error') {
									sweetAlert('Oops!', response.text, 'error');
								} else {
									sweetAlert('Okey!', response.text, 'success');
									$form.find('input').val('');
									$form.find('textarea').val('');
								}
							},
							complete: function(jqXHR, status) {
								if (status != 'success')
									sweetAlert('Oops!', 'Something went wrong!', 'error');
							}
						});
					}
				});

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Menu.
			var $menu = $('#menu');

			$menu.wrapInner('<div class="inner"></div>');

			$menu._locked = false;

			$menu._lock = function() {

				if ($menu._locked)
					return false;

				$menu._locked = true;

				window.setTimeout(function() {
					$menu._locked = false;
				}, 350);

				return true;

			};

			$menu._show = function() {

				if ($menu._lock())
					$body.addClass('is-menu-visible');

			};

			$menu._hide = function() {

				if ($menu._lock())
					$body.removeClass('is-menu-visible');

			};

			$menu._toggle = function() {

				if ($menu._lock())
					$body.toggleClass('is-menu-visible');

			};

			$menu
				.appendTo($body)
				.on('click', function(event) {
					event.stopPropagation();
				})
				.on('click', 'a', function(event) {

					var href = $(this).attr('href');

					event.preventDefault();
					event.stopPropagation();

					// Hide.
						$menu._hide();

					// Redirect.
						if (href == '#menu')
							return;

						window.setTimeout(function() {
							window.location.href = href;
						}, 350);

				})
				.append('<a class="close" href="#menu">Close</a>');

			$body
				.on('click', 'a[href="#menu"]', function(event) {

					event.stopPropagation();
					event.preventDefault();

					// Toggle.
						$menu._toggle();

				})
				.on('click', function(event) {

					// Hide.
						$menu._hide();

				})
				.on('keydown', function(event) {

					// Hide on escape.
						if (event.keyCode == 27)
							$menu._hide();

				});

	});

})(jQuery);