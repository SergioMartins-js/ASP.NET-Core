antt = antt || {};
antt.siref = antt.siref || {};
antt.siref.cadastrar = {
    ExcluirLista: function (id) {
        list.splice(id, 1);
        montarGrid();
    },
    Init: function () {
        var list = [];
        $(document).ready(function () {
        
        $(".btn-consultar").on("click", function () {
            var form = $("#form-dados");
            var obj = montarObj();
            if (ContaContabilIsValid(obj.codigoContaContabil)) {
                if (ValidarContaContabil(obj.codigoContaContabil)) {
                    if (ValidarData(obj.vigenciaIncio, obj.vigenciaFim)) {
                        if ($("#form-dados").valid()) {
                            list.push(montarObj());
                            montarGrid();
                        }
                    }
                    else {
                        toastr.warning("Data Início da Vigência não pode ser maior que a Data Fim da Vigência da conta.")
                    }
                }
                else {
                    toastr.warning("Conta contábil já cadastrada.")
                }
            }
            else {
                toastr.warning("Conta contábil inválido(a)!");
            }
            });
            $(".btn-cadastrar").on("click", function () {
                $.ajax({
                    url: '@Url.Action("CadastrarContas", "ElencoDeContas")',
                    method: "POST",
                    data: { list: list }
                }).done(function (data) {
                    if (data.Success) {
                        toastr.success(data.Msg);
                        $("#gridElenco").html("");
                        list = [];
                    }
                    else {
                        toastr.error(data.Msg);
                    }
                })
            });


            $(".btn-editar").on("click", function () {
                var model = montarObj();
                $.ajax({
                    url: '@Url.Action("EditarElenco", "ElencoDeContas")',
                    method: "POST",
                    data: model
                }).done(function (data) {
                    if (data.Success) {
                        toastr.success(data.Msg);
                    }
                    else {
                        toastr.error(data.Msg);
                    }
                });
            });
        });
        function montarObj() {
            var obj = {
                Codigo: $('#Codigo').val(),
                nivelConta: $('#NivelConta').val(),
                nivelContaDesc: $('#NivelConta option:selected').text(),
                codigoContaContabil: $('#@Html.IdFor(x=>x.CodigoContaContabil)').val(),
                codigoContaRedutora: $('#@Html.IdFor(x=>x.CodigoContaRedutora)').val(),
                descricao: $('#@Html.IdFor(x=>x.Descricao)').val(),
                vigenciaIncio: $('#@Html.IdFor(x=>x.VigenciaIncio)').val(),
                vigenciaFim: $('#@Html.IdFor(x=>x.VigenciaFim)').val(),
                natureza: $('#Natureza').val(),
                naturezaDesc: $('#Natureza option:selected').text(),
                denominacaoLivre: $('#@Html.IdFor(x=>x.DenominacaoLivre)').is(":checked"),
                denominacaoLivreDesc: $('#@Html.IdFor(x=>x.DenominacaoLivre)').is(":checked") ? "Sim" : "Não",
                status: $('#@Html.IdFor(x=>x.Status)').val()
            }
            return obj;
        }
        function montarGrid() {
            $("#gridElenco").html("");
            for (var i = 0; i < list.length; i++) {
                $("#gridElenco").append("<tr><td class='text-center'>" + list[i].nivelContaDesc +
                    "</td><td class='text-center'>" + list[i].codigoContaContabil + "</td>" +
                    "</td><td class='text-center'>" + list[i].descricao + "</td>" +
                    "</td><td class='text-center'>" + list[i].naturezaDesc + "</td>" +
                    "</td><td class='text-center'>" + list[i].vigenciaIncio + " a " + list[i].vigenciaFim + "</td>" +
                    "</td><td class='text-center'>" + list[i].denominacaoLivreDesc + "</td>" +
                    "</td><td class='text-center'><button class ='btn btn-danger' onclick='excluirLista(" + i + ")'>Excluir</button></td></tr >");
            }
            toastr.success("Registro salvo!");
        }

        function ValidarContaContabil(conta) {
            for (var i = 0; i > list.length; i++) {
                if (list[i].codigoContaContabil == conta)
                    return false;
            }
            return true;
        };

        function ValidarData(dataInicio, dataFim) {
            if (dataFim != "") {
                if (dataInicio > dataFim)
                    return false;
            }
            return true;
        }

        
    }
};