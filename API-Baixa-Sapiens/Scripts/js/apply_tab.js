$(document).ready(function() {

	// CREATE CONTENT
	$('.responsive-tab').each(function(index, el) {
		var jThis = $(el),
			tabs = jThis.find('.nav-tabs'),
			tab_link = tabs.find('.nav-link');

		// tabs.addClass('d-none d-lg-flex');

		tab_link.each(function() {
			var link = $(this),
				container = link.attr('href'),
				active = link.hasClass('active') ? 'active' : '',
				disabled = link.hasClass('disabled-link') ? 'disabled-link' : '',
				html = 	'<div class="tab-mobile">'
					 + 	'<a class="mobile-link ' + active + disabled + '" href="'+container+'" role="tab"> '+link.text()+'</a>'
					 + 	'</div>'

			$(container).before(html);
		});
	});	

	// TAB 
	$('.nav-tabs').find('a').click(function(e) {
		e.preventDefault();

		var jThis = $(this),
			parent = $(jThis.closest('.responsive-tab')),
			href = $(jThis.attr('href'));

		if(!jThis.hasClass('disabled-link')){
			parent.find('.nav-link, .tab-pane, .tab-mobile a').removeClass('active');
		
			jThis.addClass('active');
			href.addClass('active').prev('.tab-mobile').find('a').addClass('active');

			if( window.innerWidth < 768){
				$('html, body').animate({
					scrollTop: href.prev('.tab-mobile').offset().top - 60
				}, 500);
			}
		}
	});

	// TAB MOBILE
	$('.tab-mobile').find('a').click(function(e) {
		e.preventDefault();
		var jThis = $(this);

		if(!jThis.hasClass('disabled-link')){
			jThis.parent().parent().find('.active').removeClass('active');
			$('.nav-link[href="'+jThis.attr('href')+'"]').click();
		}
	});

	// PREV - NEXT TAB
	$('.btn-tabContent').find('button').click(function(e) {
		e.preventDefault();

		var jThis = $(this),
			tabContainer = jThis.closest('.responsive-tab'),
			tabActive = tabContainer.find('.nav-link.active');

		// CHECK PATH
		if( jThis.hasClass('next-tab') ){ //NEXT

			var form = jThis.parentsUntil('.responsive-tab','form');

			if(form.valid()){
				console.log('Realizar uma requisição AJAX com os dados do formulário '+ form.serialize()+' e salvar os dados cadastrados');

				tabActive.addClass('checked');
				$('.mobile-link[href="'+tabActive.attr('href')+'"]').addClass('checked');

				var nextItem = tabActive.parent().next().children();

				if(nextItem.length > 0){
					$('.mobile-link[href="'+nextItem.attr('href')+'"]').removeClass('disabled-link');
					nextItem.removeClass('disabled-link').click();
				}
			}else{
				toastr.warning('* Campo obrigatório');
			}
		}else if( jThis.hasClass('prev-tab') ){ //BACK
			var prevItem = tabActive.parent().prev().children();

			if(prevItem.length > 0){
				$('.mobile-link[href="'+prevItem.attr('href')+'"]').removeClass('disabled-link');
				prevItem.removeClass('disabled-link').click();
			}
		}else{
			$('#mensagem_sucesso').addClass('active').siblings().removeClass('active');
			tabActive.addClass('checked').removeClass('active');
		}
	});
});

$(window).resize(function(){
	check_tabSize($('.responsive-tab'));
});

function check_tabSize(container){
	container.removeClass('accordion');
	if(container.children('.nav-tabs').height() > container.find('.nav-item').first().height()){
		container.addClass('accordion');
	}else{
		container.removeClass('accordion');
	}
}