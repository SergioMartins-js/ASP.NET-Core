$(document).ready(function($) {
	// TOGGLE EVENTS
	$('body').on('click', '[data-toggle="class"]', function(e) { // TOGGLE CLASS
		e.preventDefault();
		var jThis = $(this);

		$(jThis.data('target')).toggleClass('active');

		$(jThis.data('target')).hasClass('active') && jThis.hasClass('toggleMenu') ? $('body').css('overflow','hidden') : $('body').css('overflow','visible') ;
	}).on('click', '[data-toggle="collapse-next"]', function(e) { // TOGGLE VISIBILITY
		e.preventDefault();
		$(this).toggleClass('active').next().stop().slideToggle('fast', function(){
			$(window).resize();
		});
	}).on('click', '[data-toggle="collapse-target"]', function(e) { // TOGGLE VISIBILITY
		e.preventDefault();
		var jThis = $(this);
		var parent = jThis.attr('data-parent');
		var href = jThis.attr('href');

		$('.nav-link').removeClass("active");
		jThis.addClass("active");
		$(parent).children().removeClass("active");
		$(href).addClass("active");

	}).on('click', '.nav-link.bg-transparent.border-0', function(e){
		var jThis = $(this);
		$(jThis).removeClass("active");
		$(jThis).children('i').toggleClass("fa-chevron-down fa-chevron-up")
	});

	$('.changeContent').change(function(event) {
		var jThis = $(this);
		$(jThis.data('container')).children().hide();
		$(jThis.find('option:selected').data('content')).css('display','flex');
	});
});