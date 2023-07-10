$(document).ready(function() {
	$('.pagination-content').load('/Scripts/js/include/pagination.html',function(){
		// ON CLICK PAGINATION BUTTON
		$('.pagination-content').find('button').click(function(e) {
			e.preventDefault();
			var jThis = $(this),
				form = jThis.closest('form');

			// UPDATE ACTUAL PAGE
			form.find('.searchPage').val( jThis.val() );

			console.log('Realizar requisição AJAX com os dados do formulário '+ form.serialize() );
		});

		// ON CHANGE RPP
		$('.rpp').change(function(event) {
			console.log('Realizar requisição AJAX com os dados do formulário '+ $(this).closest('form').serialize() );
		});
	});
});