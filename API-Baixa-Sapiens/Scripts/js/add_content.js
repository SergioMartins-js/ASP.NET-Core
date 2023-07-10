$(document).ready(function() {
	$('.add_content').click(function(event) {
		var jThis = $(this),
 			target = jThis.data('target'),
 			elm = jThis.data('content').split(','),
 			form = $(jThis.data('form')),
 			inputArr = [],
 			inputs = $(form.find('.form-control')).each(function(index,elm){
				inputArr.push(this);
			})
			valid = true;

		inputArr.map(function(item) {
			if( $(item).val() == '' ){
				$(item).addClass('error');
				valid = false;
			}else{
 				$(item).removeClass('error');
			};
		});

		if(valid){
			
 			var html = '<div class="col-auto">'
 					 + 		'<div class="item border bg-gray">'
 					 +  		'<span>'+elm.map(function(item) { return $(item).val()}).join(' / ')+'</span>'
 					 +			'<i class="fas fa-times removeContent"></i>'
 					 +			'<div class="input-control">'
 					 +				inputArr.map(function(item) {return '<input type="hidden" name="'+item.name+'_saved" value="'+item.value+'" />'}).join('')
 					 +			'</div>'
 					 +		'</div>'
 					 +	'</div>'

			$(target).append(html);

			// RESET FORM
			form.find('.form-control').val('').end()
				.find('.select2').trigger('change');
		}else{
			toastr.warning('* Campo obrigatório');
		}

		checkContent(target);
	});

	$('.add_content-container').on('click', '.removeContent', function(e) {
		e.preventDefault();

		var item = $(this).parent().parent(),
			target = item.parent();

		item.slideUp('fast',function(){
			item.remove();
			checkContent(target);
		});
		
	});
});	

// CHECK CONTENT
function checkContent(target){
	$(target).children('div').length > 0 ? $(target).find('h3').hide() : $(target).find('h3').show();
}