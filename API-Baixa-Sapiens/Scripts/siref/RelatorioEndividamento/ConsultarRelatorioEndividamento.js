function format(d) {
    return '<table cellpadding="5" cellspacing="0" border="1" class="table-details" style="background-color:#e5e5e5">' +
        '<tr>' +
        '  <td><strong>Valor Liberado</strong>' +
        '    <p>' + formatMoney(d.valorLiberado) + '</p>' +
        '  </td>' +
        '  <td><strong>Taxa de Juros Nominal</strong>' +
        '    <p>' + d.taxaJurosNominal + '%</p>' +
        '  </td>' +
        '  <td><strong>IOF</strong>' +
        '    <p>' + d.iof + '%</p>' +
        '  </td>' +
        '  <td><strong>Periodicidade de <br>' +
        '    pag. dos juros</strong>' +
        '    <p>' + d.periodicidadeJuros + '</p>' +
        '  </td>' +
        '  <td><strong>Outros Encargos</strong>' +
        '    <p>' + d.outrosEncargos + '</p>' +
        '  </td>' +
        '  <td><strong>Saldo Devedor</strong>' +
        '    <table><tr><td>Principal</td> <td>Juros</td></tr><tr><td>' + formatMoney(d.saldoDevedorPrincipal) + '</td> <td>' + formatMoney(d.saldoDevedorJuros) + '</td></tr></table>' +
        '  </td>' +
        '  <td><strong>Garantias</strong>' +
        '    <p>Bens Dados: ' + d.garantiaBensDadosGarantia + '<br/>' +
        '       Valor Caucionado: ' + formatMoney(d.garantiaValorCaucionado) + '<br/>' +
        '       Depósito Bloqueado: ' + formatMoney(d.garantiaDepositoBloqueado) + '<br/>' +
        '       Outras: ' + d.garantiaOutras + '<br/>' +
        '  </p>' +
        '  </td>' +
        '  <td><strong>Operação</strong>' +
        '    <p>' + d.operacao + '</p>' +
        '  </td>' +
        '  <td><strong>Encerramento <br>' +
        '    do Contrato</strong>' +
        '    <p>' + moment(d.dataEncerramentoContrato).format('DD/MM/YYYY') + '</p>' +
        '  </td>' +
        '</tr>' +
        '</table>'
}

$(function () {



    var form = $('#Relatorio');
    var dt = $('#resultado').DataTable({
        order: [[1, 'desc']],
        processing: true,
        lengthMenu: [10, 20, 30],
        pageLength: 10,
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
        columnDefs: [
            {
                targets: [-1],
                searchable: false,
                orderable: false,
                defaultContent: '<a href="#" class="icon-history" title="Histórico"><i class="fas fa-clock"></i> <span class="sr-only">Histórico</span></a>'
            }
        ],
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
        columns: [
            {
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": '<i class="far fa-plus-square"></i> ',
                "width": '5%'
            },
            {
                title: 'Concessionária',
                width: '15%',
                data: 'concessionaria'
            },
            {
                title: 'Nº do Contrato',
                width: '15%',
                data: 'numeroContrato'
            },
            { title: 'Instituição', width: '25%', data: 'instituicao' },
            {
                title: 'Data de Celebração do Contrato', width: '20%', data: 'dataCelebracaoContrato',
                render: function (data) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                title: 'Valor do Montante Contratado',
                width: '20%',
                data: 'valorMontante',
                render: function (data) {
                    return formatMoney(data);
                }
            },
            {
                title: 'Históricos',
                width: '5%',
                data: null
            }
        ],
        fnDrawCallback: function (oSettings) {
            if ($('#resultado tbody tr .dataTables_empty').length == 0) {
                $('#btnExportarExcel').show();
            } else {
                $('#btnExportarExcel').hide();
            }
        }
    });

    var $resultado = $('#resultado tbody');

    $resultado.on('click', 'a.icon-history', function () {
        var data = dt.row($(this).parents('tr')).data();
        window.location = $.UrlRootPath + '/RelatorioEndividamento/Historico/' + data.id;
    });

    form.submit(function (event) {
        if (event.target.action.indexOf("Excel") >= 0 || event.target.action.indexOf("Pdf") >= 0) {
            return true;
        }

        if (!validateForm())
            return false;

        var formArray = form.serializeArray();
        var _queryString;
        $.each(formArray, function (index, value) {
            var nome = value.name;
            var valor = value.value;
            if (value.name.indexOf("Vigencia") >= 0) {
                valor = FormatDate(valor);
            }
            if (_queryString != undefined) {
                _queryString = _queryString + nome + "=" + valor + "&";

            }
            else {
                _queryString = nome + "=" + valor + "&";
            }
        });
        event.preventDefault();
        dt.ajax.url('Listar?' + _queryString).load();
        return true;
    });

    function FormatDate(valor) {
        var dia = valor.substr(0, 2);
        var mes = valor.substr(3, 2);
        var ano = valor.substr(6, 4);
        valor = mes + "/" + dia + "/" + ano;
        return valor;
    }

    $resultado.on('click', 'td.details-control', function () {

        var tr = $(this).closest('tr');
        var row = dt.row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            $(this).html("<i class='far fa-plus-square '></i>");
        }
        else {
            // Open this row
            row.child(format(row.data())).show();
            $(this).html("<i class='far fa-minus-square '></i>");
        }
    });
});
$("#RazaoSocial, #Cnpj, #NumeroContraton, #Vigencia_Final, #Vigencia_Inicio").on("keyup", function () {
    removerErros();
});
$("#Vigencia_Final, #Vigencia_Inicio").on("change", function () {
    removerErros();
});


function validateForm() {
    var cnpj = $('#Cnpj').val().trim();
    var contrato = $("#NumeroContrato").val().trim();
    var razao = $("#RazaoSocial").val().trim();
    var dataIN = $("#Vigencia_Inicio").val().trim();
    var dataFI = $("#Vigencia_Final").val().trim();
    if (cnpj == "" && contrato == "" && razao == "" && dataIN == '' && dataFI == '') {
        $("#Cnpj").addClass("error");
        $("#Vigencia_Inicio").addClass("error");
        $("#Vigencia_Final").addClass("error");
        $("#NumeroContrato").addClass("error");
        $("#RazaoSocial").addClass("error");

        toastr.warning("É obrigatório informar pelo menos um filtro de pesquisa. ");
        return false;
    }


    if (cnpj != '') {
        if (!CnpjIsValid(cnpj)) {
            toastr.error("CNPJ inválido!");
            return false;
        }
    }
    var dataValidaVigenciaInicio = true;
    if (dataIN != '') {
        dataValidaVigenciaInicio = dataFI != '';
    }

    var dataValidaVigenciaFinal = true;
    if (dataFI != '') {
        dataValidaVigenciaFinal = dataIN != '';
    }

    if (contrato != "") {
        var mensagemErro = "";
        var erros = 0;

        if (dataIN == '' || dataIN == '')
        {
            $("#Vigencia_Inicio").addClass("error");
            $("#Vigencia_Final").addClass("error");
            mensagemErro += "Deve ser informado um período";
            erros++;
        }

        if (cnpj == "" && razao == "") {
            mensagemErro += "\n Deve ser informado CNPJ ou razão social!";
            $("#Cnpj").addClass("error");
            $("#RazaoSocial").addClass("error");
            erros++;
        }
        if (erros > 0) {
            toastr.warning(mensagemErro);
            return false;
        }
    }
    
    if (!dataValidaVigenciaInicio || !dataValidaVigenciaFinal) {
        toastr.error("Período inválido!");
        return false;
    }

    if (dataValidaVigenciaFinal && dataValidaVigenciaInicio && dataFI != '' && dataIN != '' ) {
        var dtInicio = new Date(moment(dataIN, "DD/MM/YYYY"));
        var dtFim = new Date(moment(dataFI, "DD/MM/YYYY"));
        if (dtInicio > dtFim) {
            toastr.error("Período inválido!");
            return false;
        } 
    } 


    return true;
}

function removerErros() {
    $("#Cnpj").removeClass("error");
    $("#Vigencia_Inicio").removeClass("error");
    $("#Vigencia_Final").removeClass("error");
    $("#NumeroContrato").removeClass("error");
    $("#RazaoSocial").removeClass("error");
}

function exportarArquivo(url) {
    $("#modal_demand").modal("hide");
    var form = $('#Relatorio');
    form.attr('action', url);
    form.attr('method', 'POST');
    form.submit();
    form.attr('action', '#');
    form.attr('method', 'GET');
}