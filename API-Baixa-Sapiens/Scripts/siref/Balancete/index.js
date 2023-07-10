main();

function main() {
    BuscarAnosCadastrados();
    GetRazaoSocial();
}

function GetRazaoSocial() {

    $("#Cnpj").blur(function () {
        var _cnpj = $('#Cnpj').val();
        if (CnpjIsValid(_cnpj)) {
            $.ajax({
                url: 'BuscarConcessionariaAtual',
                data: { cnpj: _cnpj },
                success: function (data) {
                    $('#RazaoSocial').val(data);
                }
            });
            TipoCnpjMesPreenchidos();
        } else {
            toastr.warning("Campo Cnpj inválido.");
            $("#Cnpj").addClass("error");
        }
    });

    $("#Mes").change(function () {
        var _mes = $('#Mes').val();
        var _cnpj = $('#Cnpj').val();
        var _ano = $('#Ano').val();

        if (_mes != "" && _cnpj != "") {
            $.ajax({
                url: 'BuscarConcessionariaVigente',
                data: { cnpj: _cnpj, mes: _mes, ano: _ano },
                success: function (data) {
                    if (data != "")
                        $('#RazaoSocial').val(data);
                }
            });
        }
    });

    $("#TipoDeDocumento").change(function () {
        TipoCnpjMesPreenchidos();
    });

    $("#Ano").change(function () {
        TipoCnpjMesPreenchidos();
    });
}

function BuscarAnosCadastrados() {
    $.ajax({
        type: "GET",
        url: 'BuscarAnosCadastrados',
        success: function (data) {
            $.each(data, function (key, value) {
                $("#Ano").append(new Option(value, value));
            })
        }
    });
}

function TipoCnpjMesPreenchidos() {
    var _tipo = $('#TipoDeDocumento').val();

    var preenchidos = _tipo == "1";
    if (preenchidos == true) {
        $('#mesDiv').css("display", "block");
    } else {
        $('#mesDiv').css("display", "none");
    }
}

function exportarArquivo(url) {
    var form = $('#Relatorio');
    form.attr('action', url);
    form.attr('method', 'POST');
    form.submit();
    form.attr('action', '#');
    form.attr('method', 'GET');
}

$(function () {
    var form = $('#Relatorio');
    var dt = $('#resultado').DataTable({
        order: [[1, 'desc']],
        processing: true,
        lengthMenu: [10, 20, 30],
        serverSide: true,
        deferRender: true,
        deferLoading: true,
        language: {
            paginate: {
                previous: "<i class=\"fas fa-angle-left\"></i>",
                next: "<i class=\"fas fa-angle-right\"></i>"
            },
            lengthMenu: "Registros por página _MENU_ ",
            sEmptyTable: "Nenhum registro encontrado",
            sInfo: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            sInfoEmpty: "Mostrando 0 até 0 de 0 registros",
            sInfoFiltered: "(Filtrados de _MAX_ registros)",
            sInfoPostFix: "",
            sInfoThousands: ".",
            sLoadingRecords: "Carregando...",
            sProcessing: "Processando...",
            sZeroRecords: "Nenhum registro encontrado",
            sSearch: "Pesquisar",
            oPaginate: {
                sNext: "Próximo",
                sPrevious: "Anterior",
                sFirst: "Primeiro",
                sLast: "Último"
            },
            oAria: {
                sSortAscending: ": Ordenar colunas de forma ascendente",
                sSortDescending: ": Ordenar colunas de forma descendente"
            }
        },
        dom: '<"float-right"l>rt<"center"p><"clear">',
        info: false,
        pagingType: "simple_numbers",
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
        columns: [
            {
                title: 'Código da Conta',
                width: '10%',
                data: 'conta',
            },
            {
                title: 'Descrição',
                width: '15%',
                data: 'descricao',
            },
            {
                title: 'Saldo Anterior',
                width: '15%',
                data: 'saldoAnteriorDisplay',
                render: function (data) {
                    return data;
                }
            },
            {
                title: 'Crédito',
                width: '15%',
                data: 'credito',
                render: function (data) {
                    return formatMoney(data);
                }
            },
            {
                title: 'Débito',
                width: '15%',
                data: 'debito',
                render: function (data) {
                    return formatMoney(data);
                }
            },
            {
                title: 'Saldo Atual',
                width: '15%',
                data: 'saldoAtual',
                render: function (data) {
                    return formatMoney(data);
                }
            }
        ],
        fnDrawCallback: function (oSettings) {
            if ($('#resultado tbody tr .dataTables_empty').length == 0) {
                $('#btnExportarExcel').show();

                var cnpj = $("#Cnpj").val();
                var tipoDocumento = $("#TipoDeDocumento").val();
                var mes = $("#Mes").val() == "" ? "0" : $("#Mes").val();
                var ano = $("#Ano").val();

                $.ajax({
                    url: $.UrlRootPath+"Balancete/ListarTotais?cnpj=" + cnpj + "&tipoDocumento= " + tipoDocumento + "&mes=" + mes + "&ano=" + ano,
                    success: function (data) {
                        if (data.Resumo) {
                            $("#resultado tbody #resumoTotal").remove();
                            $("#resultado tbody #resumoTotalEncerramento").remove();
                            $("#resultado tbody #resumoTotalDezembro").remove();
                            
                            $("#resultado tbody").append("<tr id='resumoTotal' style='text-align: center;'><td colspan='3'>Total</td><td style='text-align:left;'>" + data.Resumo.TotalCreditos.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + "</td><td style='text-align:left;'>" + data.Resumo.TotalDebitos.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + "</td><td style='text-align:left;'>-</td></tr>");

                            if (tipoDocumento == 26) {
                                $("#resultado tbody").append("<tr id='resumoTotalEncerramento' style='text-align: center;'><td colspan='3'>Saldo Final(Encerramento)</td><td style='text-align:left;'>" + data.Resumo.SaldoFinalEncerramento.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + "</td><td style='text-align:left;'>-</td><td style='text-align:left;'>-</td></tr>");
                                $("#resultado tbody").append("<tr id='resumoTotalDezembro' style='text-align: center;'><td colspan='3'>Saldo Final(Dezembro)</td><td style='text-align:left;'>" + data.Resumo.SaldoFinalMes12.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) + "</td><td style='text-align:left;'>-</td><td style='text-align:left;'>-</td></tr>");
                            }
                        }else if(data.success == false){
                            Mensagem(data.errorMessage,"Erro");
                        }
                    }
                });
            } else {
                $('#btnExportarExcel').hide();
            }
        }
    });



    form.submit(function (event) {
        if ($("#RazaoSocial").val() != "") {
            $("#Cnpj").removeAttr("required");
        } else {
            $("#Cnpj").attr("required", "required");
        }

        var cnpj = $("#Cnpj").val();
        if (cnpj != "") {
            if (!CnpjIsValid(cnpj)) {
                toastr.warning("Campo Cnpj inválido.");
                $("#Cnpj").addClass("error");
                return false;
            }
        }

        var tipoDocumento = $("#TipoDeDocumento option:selected").text();

        if (tipoDocumento === "Balancete Mensal Analítico") {
            $("#Mes").attr("required", "required");
        } else {
            $("#Mes").removeAttr("required");
            $("#Mes").val("");
        }

        if (event.target.action.indexOf("Excel") >= 0 || event.target.action.indexOf("Pdf") >= 0)
            return true;

        event.preventDefault();
        if (form.valid()) {
            dt.ajax.url('ListarRelatorioBalancetes?' + form.serialize()).load();
        }

        return true;
    });

});
