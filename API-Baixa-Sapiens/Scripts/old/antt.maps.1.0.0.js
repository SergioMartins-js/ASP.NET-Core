(function(antt, $) {

    function Coordinate(index, latitude, longitude) {
        this.index = index;
        this.latitude = latitude;
        this.longitude = longitude;
    };

    Coordinate.prototype.toString = function dogToString() {
        return this.latitude + "," + this.longitude;
    };

    antt.maps = {
        url: "",

        configure: function() {

            $("a[data-coordinates-map]").off("click").on("click",
                function(event) {
                    debugger;

                    // previne o click no link
                    event.preventDefault();

                    var self = $(this);

                    // recupera o nome do mapa, que será utilizado para recuperar os outros elementos que possuem as coordenadas
                    var map = self.attr("data-coordinates-map");

                    // armazenará as coordenadas para cada índice
                    var coordinates = [];

                    // recupera os elementos que possuem as coordenadas
                    $("[data-coordinates-map=" + map + "]").each(function() {

                        // recupera o elemento
                        var element = $(this);

                        // recupera o valor da coordenada
                        var value = element.val().replace(",", ".");

                        // valor da propriedade que será atribuída
                        var index, property;

                        // elemento possui informações de latitude?
                        if (element.is("[data-coordinates-latitude]")) {

                            // recupera o índice do elemento para plotagem no mapa
                            index = parseInt(element.attr("data-coordinates-latitude"));
                            property = "latitude";
                        }
                        // elemento possui informações de longitude?
                        else if (element.is("[data-coordinates-longitude]")) {

                            // recupera o índice do elemento para plotagem no mapa
                            index = parseInt(element.attr("data-coordinates-longitude"));
                            property = "longitude";
                        }
                        // nada a fazer
                        else {

                            // zera as variáveis de controle
                            index = null;
                            property = null;
                        }

                        // identificou latitude ou longitude
                        if (index != null && property != null) {

                            // localiza a coordenada pelo índice
                            var coordinate = null;
                            for (var i = 0; i < coordinates.length; i++) {
                                if (coordinates[i].index == index) {
                                    coordinate = coordinates[i];
                                    break;
                                }
                            }

                            // não encontrou?
                            if (coordinate == null) {

                                // cadastra e adiciona ao array
                                coordinate = new Coordinate(index, "", "");
                                coordinates.push(coordinate);

                            }

                            // atualiza a propriedade identificada
                            coordinate[property] = value;

                        }

                    });

                    // ordena as coordenadas conforme o índice
                    coordinates.sort(function(a, b) {
                        return a.index - b.index;
                    });

                    // gera a url concatenando latitudes e longitudes
                    //var url = "https://www.google.com.br/maps/dir/" + coordinates.join('/');

                    console.log(coordinates);

                    console.log(antt.maps.url);

                    var url = antt.maps.url +
                        "?latOrigem=" +
                        coordinates[0].latitude +
                        "&longOrigem=" +
                        coordinates[0].longitude +
                        "&latDestino=" +
                        coordinates[1].latitude +
                        "&longDestino=" +
                        coordinates[1].longitude;

                    console.log(url);

                    // abre em uma nova janela
                    window.open(url);

                    return false;

                });

        }

    };

})(window.antt = window.antt || {}, jQuery);

$(function() {
    antt.maps.configure();
    $(document).ajaxComplete(function() {
        antt.maps.configure();
    });
});