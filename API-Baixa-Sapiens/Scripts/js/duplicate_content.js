function applyPlugins(duplicateContainer){
	// RENAME CONTENT
	rename(duplicateContainer);

	//  APPLY PLUGINS
	applySelect(duplicateContainer);
	applyMask(duplicateContainer);
}

$(document).ready(function() {

	// ON CLICK ITEM
	$('.duplicate-content').on('click', '.action-ico', function(event) {
		
		var jThis = $(this),
			content = jThis.parent(),
			duplicateContainer = content.closest('.duplicate-content'),
			container = content.parentsUntil('.duplicate-content','.row');

		// REMOVE PLUGINS
		duplicateContainer.find('select.select2').select2('destroy').end()
						  .find('[data-select2-id]').removeAttr('data-select2-id');

		// CHECK CONTENT
		if(content.hasClass('plus-content')){ // ADD CONTENT
			container.after( container.clone() );

			// CLEAR INPUTS
			container.next().find('input').val('');
			
			applyPlugins(duplicateContainer);
		}else{	// REMOVE CONTENT
			container.slideUp('fast',function(){
				container.remove();	
				applyPlugins(duplicateContainer);
			})
		}
	});

});

// RENAME CONTENT
function rename(container) {
	var item = container.children();

	// CHECK IF MINUS HAS TO SHOW 
	item.length > 1 ? container.find('.minus-content').find('i').show() : container.find('.minus-content').find('i').hide();

	// FOR EACH LINE
	item.each(function(index, el) {
		var index_line = index;

		$(this).find('[data-name]').each(function(index, el) {
			var input = $(this);

            input.attr('name', input.data('name') + '[' + index_line + ']');            
            input.attr('id', input.data('name') + '[' + index_line + ']');
		});
	});	

}