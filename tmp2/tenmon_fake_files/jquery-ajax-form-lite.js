/*
 * Created On 2014-02-08 by AstroArts Inc.
 *
 * # NAME
 *
 * ajax-form-lite.js
 * Make form submit via AJAX.
 *
 * *IMPORTANT*
 * *We don't care xhr2 unsupported browser. *
 * If the form enctype is 'multipart/form-data', ajax-form-lite
 * build xhr2 file upload.
 *
 * # USAGE
 *
 * $('form').ajaxFormLite(opts);
 *
 * # OPTIONS
 *
 * indicator
 * : speicy indicator element.
 *   we call show() before submit and call hide() at end.
 *
 * progress
 * : progress callback handler called with argument xhr2
 *   progeess event.
 *
 * extraData
 * : extra data object.
 *
 * reload
 * : If true, reload URL after request successful.
 *
 * And we accept most of jQuery ajax option parameter such as url,
 * async, dataType etc. But some parameter will overwritten.
 *
 * * data
 * * contentType
 * * processData
 *
 * # DEFAULT SUCCESS HANDLER BEHAVIOR
 *
 * If you don't set success option, ajaxFormLite set default success
 * handler.
 * Handler accepts JSON response.
 *
 * status
 * : 0 when success. non 0 are error.
 *
 * message
 * : server error or info message.
 *
 * url
 * : change URL when request success.
 *
 * reload
 * : Reload when request success.
 *
 */

(function ($) {
	$.fn.ajaxFormLite = function(a) {
		var lock_key = 'ajax_form_lite_lock';
		var opts = a || {};
		
		this.submit(function(){
			var form = $(this);

			var indicator = opts.indicator;
			var reload = opts.reload;
			var settings = $.extend({
				url: this.action,
				async: true,
				cache: false,
				dataType: 'json',
				beforeSend: function(xhr){
					if (indicator) {
						$(indicator).show();
					}
				},
				success: function(res,txt,xhr){
					if (0 < res.status) {
						alert(res.message);
						return;
					}
					if (res.message) {
						alert(res.message);
					}
					if (res.url) {
						location.href = res.url;
						return;
					}
					if (reload || res.reload) {
						location.reload(true);
						return;
					}
				},
				error: function(xhr,txt){
					alert("Server Error: " + txt);
				},
				complete: function(xhr,txt){
					if (indicator) {
						$(indicator).hide();
					}
					form.removeData(lock_key);
				},
				indicator: null
			}, opts);

			if (! form.data(lock_key)) {
				form.data(lock_key, true)
				if (settings.indicator) {
					$(settings.indicator).show();
				}
				if (! settings.type) {
					settings.type = this.method || 'POST';
				}
				if (this.enctype == 'multipart/form-data') {
					settings.contentType = false;
					settings.processData = false;
					settings.data = new FormData(this);
					xhr_fields = {
						onprogress: function(e) {
							if (e.upload && settings.progress) {
								settings.progress(e);
							}
						}
					};
					if (settings.xhrFields) {
						xhr_fields = $.extend(xhr_fields, settings.xhrFields);
					}
					settings.xhrFields = xhr_fields;
				}
				else {
					settings.data = form.serialize();
				}
				$.ajax(settings);
			}
			return false;
		});
	}
}(jQuery));

