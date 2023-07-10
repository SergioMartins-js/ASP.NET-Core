$(document).ready(function() {
    
    $('.apply_chart').each(function(index, el) {
        
        // CONFIG
        var ctx = el,
            type = $(el).data('type'),
            path = $(el).data('path'),
            value = $(el).data('value'),
            total = $(el).data('total'),
            options = {
                legend: { display: false },
                aspectRatio: 1.2,
                tooltips: {
                    enabled: type === 'doughnut' ? false : true
                },
                cutoutPercentage: type === 'doughnut'
                    ? $(el).hasClass('small-chart') ? 90 : $(el).hasClass('medium-chart') ? 75 : 60: 0
            };

        // JSON REQUEST
        $.getJSON(path,
            function(json) {
                // fetch(path).then(json => json.json()).then(function(json){

                // CHECK IF THE VALUE IS A PART OF TOTAL
                if ($(el).hasClass('relative')) {
                    var data = {
                        labels: json.labels,
                        datasets: [
                            {
                                data: [json.datasets[0].data[0], json.datasets[0].data[1] - json.datasets[0].data[0]],
                                backgroundColor: json.datasets[0].backgroundColor
                            }
                        ]
                    };
                } else {
                    var data = json;
                }

                // INIT PLUGIN
                chartContent = new Chart(ctx,
                    {
                        type: type,
                        data: data,
                        options: options
                    });

                // ANIMATE PERCENT NUMBER
                if ($(el).siblings('.percent-chart').length > 0) {
                    var percent = parseInt((100 * json.datasets[0].data[0]) / json.datasets[0].data[1]),
                        currValue = 0,
                        delta = 600 / percent,
                        target = $(el).siblings('.percent-chart'),
                        timer = setInterval(function() {
                                currValue += 1;
                                target.text(currValue + '%');

                                currValue == percent ? clearInterval(timer) : true;
                            },
                            delta);
                    target.addClass('active');
                }

                if ($(el).closest('.card-body').find('.info-content').length > 0) {
                    var info_content = $(el).closest('.card-body').find('.info-content'),
                        html = '<ul class="list-unstyled">' +
                            json.datasets[0].data.map(function(elm, index) {
                                var list_item = '<li>' +
                                    '<span class="infoColor" style="background-color: ' +
                                    json.datasets[0].backgroundColor[index] +
                                    '"></span>' +
                                    '<span>' +
                                    elm +
                                    '% ' +
                                    json.labels[index] +
                                    '</span>' +
                                    '</li>'
                                return list_item
                            }).join('') +
                            '</ul>'
                    info_content.html(html);
                }
            });


    });

});