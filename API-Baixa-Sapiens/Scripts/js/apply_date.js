function apply_datepicker(elm, options) {
	elm.datetimepicker(options);
}

function apply_rangeDate (elm, options){
    elm.find('.initialDate').datetimepicker(options)
    elm.find('.initialDate').on('change.datetimepicker', function(e) {
    	elm.find('.finalDate').datetimepicker('minDate', e.date);
	});
 	elm.find('.finalDate').datetimepicker(options);
}

$(document).ready(function($) {

	// DEFAULT OPTIONS
	var options = {
        format: 'L LT',
        language: 'pt-BR',
		widgetPositioning: {
			vertical:'bottom'
        }       
	}

	// SIMPLE DATE
	$('.datepicker').each(function(index, el) {
		apply_datepicker($(el), options);
	});

	// RANGE DATE
	$('.dateRange').each(function(index, el) {
		apply_rangeDate($(el), options);
	});

	// DATE ONLT
	var options_dateOnly = {
		format: 'L',
		widgetPositioning: {
			vertical:'bottom'
		}
	}

	$('.dateOnly').each(function(index, el) {
		apply_datepicker($(el), options_dateOnly);
	});

	// RANGE DATE
	$('.dateOnly_Range').each(function(index, el) {
		apply_rangeDate($(el), options_dateOnly);
	});
});