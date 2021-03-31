function moonage(selector){
	if (undefined != jQuery) {
		$(document).ready(function(){
			$.get('/widget/moonage/moonage-j.shtml', function(data){
				$(selector).html(data);
			})
		});
	}
}
