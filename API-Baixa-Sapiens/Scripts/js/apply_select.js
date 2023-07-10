$(document).ready(function() {
	applySelect($('body'));
});

function applySelect(container){
	container.find('.select2').select2({
	 	minimumResultsForSearch: 10
	}).on('change', function (e) {
		$(e.currentTarget).removeClass('error')
	});
}