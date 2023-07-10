antt = antt || {};
antt.siref = antt.siref || {};
antt.siref.editar = {
    ValidarDataMaiorMenor: function () {
        var dataInicio = $("#Vigencia_Inicio").val();
        var dataFim = $("#Vigencia_Final").val();
        if (dataFim != "" && dataInicio != "" && convertData(dataInicio) > convertData(dataFim)) {
            toastr.error("Data inicial maior que data final.");
            return false;
        }
        return true;
    },
    ValidarDataEnvio: function () {

        var campo = $('#DataLimiteEnvio').val();

        if (campo) {

            var ano = convertData($("#Vigencia_Final").val()).getFullYear();
            var dataEnvio = campo + "/" + ano;

            if (!dataValida(dataEnvio)) {
                toastr.error("Data limite para envio inválida.");
                return false;
            }

            if (convertData(dataEnvio) < convertData($('#Vigencia_Inicio').val())) {
                toastr.error("Data de envio é menor que a data de início! Favor informar uma data válida.");
                return false;
            }
        }
        return true;
    },
}

$(document).ready(function () {
    $('.diaMes').mask('00/00');

    $('#salvar').on('click', function () {
        if ($('form').valid() && antt.siref.editar.ValidarDataMaiorMenor() && antt.siref.editar.ValidarDataEnvio()) {
            return true;
        }

        return false;
    });
});