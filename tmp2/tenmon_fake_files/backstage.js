// check window width utilities
// 768 <= w
function over_sm() {
	return (window.innerWidth >= 768) ? true : false;
}
// 992 <= w
function over_md() {
	return (window.innerWidth >= 992) ? true : false;
}
// 1200 <= w
function over_lg() {
	return (window.innerWidth >= 1200) ? true : false;
}

function is_app() {
	// return window.innerWidth < 768;
	return false;
}

$(document).ready(function(){
	var button;
	$('form.ajax-url-form').submit(function(){
		var form = $(this);
		$.ajax({
			'url': this.action,
			'type': this.method,
			'data': form.serialize(),
			'dataType': 'json',
			'async': true,
			'cache': false,
			'success': function(res,txt,xhr){
				if (0 < res.status) {
					alert(res.message);
					return;
				}
				location.href = res.url;
			}
		});
		return false;
	});

	$('form.ajax-reload-form').submit(function(){
		var form = $(this);
		$.ajax({
			'url': this.action,
			'type': this.method,
			'data': form.serialize(),
			'dataType': 'json',
			'async': true,
			'cache': false,
			'success': function(res,txt,xhr){
				if (0 < res.status) {
					alert(res.message);
					return;
				}
				if (res.message) {
					alert(res.message);
				}
				location.reload(true);
			}
		});
		return false;
	});

	$('.ajax-upload-form').each(function(form){
		$(this).ajaxFormLite({
			'indicator': $(this).find('.indicator'),
			'reload': true});
	});

	if (is_app()) {
		$('#header').hide();
		$('.breadcrumb').hide();
	}
	

	// thumbnail画像を高解像度に切り替える
	if (over_sm()) {
		$('img.has-lg').each(function(idx, elm){
			elm.src = $(elm).attr('data-lg');
		});
	}
	var refresh_ad;
	refresh_ad = function(){
		var ads = $('#headline .item.ad');
		if (0 < ads.length) {
			var n = ads.length;
			var url = $(ads[0]).attr('data-refresh');
			$.ajax({
				'url': url,
				'method': 'GET',
				'error': function(xhr,err){ return; },
				'success': function(res,txt,xhr){
					if (0 != res.status) { return; }
					var i = 0;
					for (; i < n; i++) {
						var item = $(ads[i]);
						var ad = res.ads[i];
						item.find('a').attr('href', ad.url);
						item.find('.title a').text(ad.title);
						item.find('.summary').text(ad.summary);
						item.find('img').attr('src', ad.large_icon_url);
						// item.find('img').attr('data-lg', ad.large_icon_url);
					}
					window.setTimeout(refresh_ad, 10000);
				}
			});
		}
	};
	refresh_ad();
	// window.setTimeout(refresh_ad, 10000);
	// $('.dropdown-toggle.popup').hover(
	// 	function(){
	// 		var menu = $(this).parent().find('.dropdown-menu');
	// 		menu.show();
	// 	},
	// 	function(){
	// 		var menu = $(this).parent().find('.dropdown-menu');
	// 		menu.hide();
	// 	});
});
