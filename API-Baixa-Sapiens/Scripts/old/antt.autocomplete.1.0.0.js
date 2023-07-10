(function(antt, $) {

    antt.autocomplete = {
        configure: function() {

            $("[data-autocomplete-url]").each(function(index, obj) {

                var self = $(this);
                var selfselector = "#" + self.attr("id");

                // para requisição
                var url = self.attr("data-autocomplete-url");
                var method = self.attr("data-autocomplete-method");

                // para exibição na tela
                var textfield = self.attr("data-autocomplete-textfield") || "text";
                var valuefield = self.attr("data-autocomplete-valuefield");
                var minlength = self.attr("data-autocomplete-minlength") || 3;

                // para atualização depois de selecionar o item
                var targetid = self.attr("data-autocomplete-targetid");

                // verifica se permite texto customizado (sem selecionar item da lista)
                var allowcustomtext = self.attr("data-autocomplete-allowcustomtext") || false;

                // parâmetros customizados
                var prefix = "data-autocomplete-args-";
                var customargs = $.map(self.get(0).attributes,
                    function(attribute) {
                        if (attribute.name.indexOf(prefix) == 0) {
                            return {
                                name: attribute.name.substring(prefix.length, attribute.name.length),
                                value: attribute.value
                            };
                        }
                    });

                // verifica se o campo deve ser limpado se algum parâmetro de entrada mudar
                var clearonargschange = self.attr("data-autocomplete-clearonargschange") || true;

                if (clearonargschange == true) {
                    // limpar o campo no caso de mudança nos campos dependentes
                    $.each(customargs,
                        function(index, item) {
                            $(item.value).change(function() {
                                $(selfselector).val("");
                                if (targetid) {
                                    $(targetid).val("").change();
                                }
                            });
                        });
                }

                // fix no IE10 que dispara o evento source quando tem acentos (http://jsfiddle.net/MilKAOS/NRGxw/1/)
                setTimeout(function() {

                        // cria o componente
                        self.autocomplete({
                            source: function(request, response) {

                                // configuran os parâmetros para o serviço
                                var args = {
                                    filtro: request.term
                                };
                                $.each(customargs,
                                    function(index, customarg) {
                                        args[customarg.name] = $(customarg.value).val();
                                    });

                                // recupera os items
                                $.ajax({
                                    url: url,
                                    dataType: "json",
                                    method: method || "POST",
                                    data: args,
                                    blockelement: self.get(0),
                                    success: function(data) {

                                        // transforma o json na estrutura esperada pelo componente
                                        response($.map(data,
                                            function(item) {
                                                return {
                                                    value: item[textfield],
                                                    id: item[valuefield]
                                                };
                                            }));
                                    }
                                });

                            },
                            select: function(event, ui) {

                                // atualiza o componente dependente, caso exista
                                if (targetid) {
                                    if (ui.item && ui.item.id) {
                                        $(targetid).val(ui.item.id).change();
                                    } else {
                                        $(targetid).val("").change();
                                    }
                                }

                            },
                            change: function(event, ui) {

                                // valida se um elemento foi selecionado
                                if (ui.item == null) {
                                    if (!allowcustomtext) {
                                        $(selfselector).val("").change();
                                    }
                                    if (targetid) {
                                        $(targetid).val("").change();
                                    }
                                } else {
                                    $(selfselector).change();
                                }

                            },
                            minLength: minlength
                        });

                    },
                    100);

            });
        }

    };

})(window.antt = window.antt || {}, jQuery);

$(function() {
    antt.autocomplete.configure();
    $(document).ajaxComplete(function() {
        antt.autocomplete.configure();
    });
});