// CHECK IE 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// ADJUST SCREEN SIZE
function adjustHeight() {
	var mainNav = $('#mainNav');

	// RESET NAV POSITION
	mainNav.css('bottom','auto');

	var nav = mainNav.children().innerHeight(),
		main = $('main').innerHeight(),
		header = $('header').innerHeight();

	// DEFINES MIN-HEIGHT BASED ON CONTEXT OR WINDOW
	nav > main ? $('html').css('min-height',nav+header+15) : $('html').css('min-height',main);

	$('#mainNav').css('bottom',0);

	// FALLBACK FOR CSS GRID
	isIE ? mainNav.css('top',header) : true;
}

// SIZE TASK
function sizeTask (){
	var card = $('#taskList_container').find('.card-body'),
		total = 0;
	card.find('>*').map(function(index,elm){total+=elm.clientHeight});
	$('#taskList_container').find('.card-body').height(total+16);
}

// ON RESIZE WINDOW
$(window).resize(function() {
	// ADJUST SCREEN SIZE
	$(window).width() >= 768 ? adjustHeight() : $('html').css('min-height','auto');

	// SIZE TASK
	isIE ? sizeTask() : true;
}).resize();

// ON READY
$(document).ready(function() {

// [START INCLUDE CODE]

	//// HEADER
	//$('header').load('master.html #header-container',function(){
	//	$(window).resize();
	//});

	//// MAIN NAV
	//$('#mainNav').load('master.html #nav-container',function(){
	//	$(window).resize();
	//});

	//// FOOTER
	//$('footer').load('master.html #footer-container',function(){
	//	$(window).resize();
	//});

	// FIXED TASK 
	//$('#content-fixedTask').load('include/task_fixed.html',function(){
	//	$(window).resize();
	//});
	

// [END INCLUDE CODE]

	
});