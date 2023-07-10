function validateForm() {
    var cnpj = $('#Cnpj').val();
    var dtInicio = $('#DataInicio').val();
    var dtFim = $('#DataFinal').val();

    if (cnpj != '' && !CnpjIsValid(cnpj)) {
        toastr.error("CNPJ inválido!");
        return false;
    }
    if (dtInicio != '' && dtFim != '' && convertData(dtInicio) > convertData(dtFim)) {
        toastr.error("Período inválido!");
        return false;
    }
    if (!dataValida(dtInicio)) {
        toastr.error("Data inválida!");
        return false;
    }
    if (!dataValida(dtFim)) {
        toastr.error("Data inválida!");
        return false;
    }
    return true;
}

function trocarDiaMes(target) {
    //trocar dia e mês antes e após de serializar
    var data = $(target).val();
    var diaI = data.substring(0, 2);
    var mesI = data.substring(3, 5);
    data = data.replace(mesI, diaI);
    data = data.replace(diaI, mesI);
    $(target).val(data);
}

function formatCpfCnpj(item) {
    if (item != null) {
        if (item.length == 11) {
            return maskCpf(item);
        }
        else
            if (item.length == 14) {
                return maskCnpj(item);
            }
    }
}

function format(d) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="1" class="table-details" style="background-color:#e5e5e5">' +
        '<tr>' +
        '  <td style="border-right: 1px solid #3a3a3a"><small><b>Início da Vigência</b></small></td>' +
        '  <td style="border-right: 1px solid #3a3a3a"><small><b>Fim da Vigência</b></small></td>' +
        '  <td style="border-right: 1px solid #3a3a3a"><small><b>Valor da Parcela Individual</b></small></td>' +
        '  <td style="border-right: 1px solid #3a3a3a"><small><b>Data de Início do <br>' +
        '    Recebimento da Receita</b></small></td>' +
        '  <td style="border-right: 1px solid #3a3a3a"><small><b>Periodicidade de Recebimento</b></small></td>' +
        '  <td style="border-right: 1px solid #3a3a3a"><small><b>Índice de Reajuste</b></small></td>' +
        '  <td style="border-right: 1px solid #3a3a3a"><small><b>Total Recebido</b></small></td>' +
        '</tr>' +

        '<tr>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + moment(d.inicioContrato).format('DD/MM/YYYY') + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + moment(d.terminoContrato).format('DD/MM/YYYY') + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.parcelaIndividual) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + moment(d.inicioRecebimentoReceita).format('DD/MM/YYYY') + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + d.periodicidadeRecebimento + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + d.indiceReajuste + '%</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.totalRecebido) + '</small></p>' +
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
        serverSide: true,
        deferRender: true,
        deferLoading: true,
        language: {
            paginate: {
                previous: "<i class=\"fas fa-angle-left\"></i>",
                next: "<i class=\"fas fa-angle-right\"></i>"
            },
            lengthMenu: "Registros por página _MENU_",
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
        dom:  '<"float-right"l>rt<"center"p><"clear">',
        info: false,
        pagingType: "simple_numbers",
        select: {
            selector: 'td:not(:first-child)',
            style: 'os'
        },
        columns: [
            {
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": '<i class="far fa-plus-square"></i>',
                "width": '5%'
            },
            {
                title: 'Razão Social',
                width: '25%',
                data: 'razaoSocial'
            },
            {
                title: 'Nº do Contrato',
                width: '15%',
                data: 'numeroContratoReceita'
            },
            {
                title: 'Cliente',
                width: '25%',
                data: 'cliente'
            },
            {
                title: 'CPF/CNPJ',
                width: '25%',
                data: 'cpfCnpj',
                render: function (data) {
                    return formatCpfCnpj(data);
                }
            },
            {
                title: 'Objeto de Contrato',
                width: '15%',
                data: 'objetoContrato'
            },
            {
                title: 'Valor do Total do Contrato',
                width: '10%',
                data: 'totalContrato',
                render: function (data) {
                    return formatMoney(data);
                }
            },
            {
                title: 'Autorização da ANTT',
                width: '10%',
                data: 'autorizacaoAntt'
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

    form.submit(function (event) {
        if (event.target.action.indexOf("Excel") >= 0 || event.target.action.indexOf("Pdf") >= 0) 
            return true;

        event.preventDefault();

        if (!validateForm())
            return false;

        trocarDiaMes('#DataInicio');
        trocarDiaMes('#DataFinal');

        dt.ajax.url('Listar?' + form.serialize()).load();

        trocarDiaMes('#DataInicio');
        trocarDiaMes('#DataFinal');

        return true;
    });

    $('#resultado tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = dt.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
            $(this).html("<i class='far fa-plus-square '></i>");
        }
        else {
            row.child(format(row.data())).show();
            $(this).html("<i class='far fa-minus-square '></i>");
        }
    });
    
});

function exportarArquivo(url) {
    $("#modal_demand").modal("hide");
    var form = $('#Relatorio');
    form.attr('action', url);
    form.attr('method', 'POST');
    form.submit();
    form.attr('action', '#');
    form.attr('method', 'GET');
    $('#modal_demand').modal('hide');
}