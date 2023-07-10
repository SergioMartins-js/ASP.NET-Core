antt = antt || {};
antt.utilities = {
    SelectList: {
        CarregarSelect: function (action, select, callback) {
            select.find('option:disabled').html('Carregando...');

            $.get(action)
                .done(function (data) {
                    data = data.results;

                    //limpa o dropdown
                    select.find('option:enabled').remove();

                    var output = [];
                    var length = data.length;
                    var a = 0;
                    for (var i = 0; i < length; i++) {
                        var item = data[i];

                        var data_string = '';
                        $.each(Object.keys(item), function (index, it) {
                            data_string += " data-{0}=\"{1}\" ".replace("{0}", it).replace("{1}", item[it]);
                        });

                        output[i++] = ('<option value="' + item.id + '" {0}>' + item.text + '</option>').replace("{0}", data_string);
                        a++;
                    }

                    select.get(0).innerHTML = '<option disabled="disabled" selected="selected" value="">Selecione</option>'
                                               + output.join('');

                    if (callback != undefined)
                        callback();
                })
                .always(function () {
                    select.find('option:disabled').html("Selecione");
                });
        },

        LimparSelect: function (select) {
            select.get(0).innerHTML = "";
            select.append('<option value="" disabled selected>Selecione</option>');
        }
    }
}
