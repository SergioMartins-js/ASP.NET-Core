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
    var data = $(target).val();
    var diaI = data.substring(0, 2);
    var mesI = data.substring(3, 5);
    data = data.replace(mesI, diaI);
    data = data.replace(diaI, mesI);
    $(target).val(data);
}

function format(d) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="1" class="table-details" style="background-color:#e5e5e5">' +

        '<tr>' +
        '  <td style="border-right: 1px solid #3a3a3a"><small><b>Operação</b></small></td>' +
        '  <td style="border-right: 1px solid #3a3a3a"><small><b>Recuperação</b></small></td>' +
        '  <td style="border-right: 1px solid #3a3a3a"><small><b>Melhoramentos</b></small></td>' +
        '  <td style="border-right: 1px solid #3a3a3a"><small><b>Outros Investimentos</b></small></td>' +
        '  <td style="border-right: 1px solid #3a3a3a"><small><b>Softwares</b></small></td>' +
        '  <td style="border-right: 1px solid #3a3a3a"><small><b>Intagível em Formação</b></small></td>' +
        '  <td style="border-right: 1px solid #3a3a3a"><small><b>Total</b></small></td>' +
        '</tr>' +

        '<tr>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>Saldo Inicial</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[0].recuperacao) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[0].melhoramento) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[0].outrosInvestimentos) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[0].softwares) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[0].intangivel) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[0].total) + '</small></p>' +
        '  </td>' +
        '</tr>' +

        '<tr>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>(+) Aquisição *</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[1].recuperacao) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[1].melhoramento) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[1].outrosInvestimentos) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[1].softwares) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[1].intangivel) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[1].total) + '</small></p>' +
        '  </td>' +
        '</tr>' +

        '<tr>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>(-) Baixa</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[2].recuperacao) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[2].melhoramento) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[2].outrosInvestimentos) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[2].softwares) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[2].intangivel) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[2].total) + '</small></p>' +
        '  </td>' +
        '</tr>' +

        '<tr>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>(+/-)Transferências</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[3].recuperacao) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[3].melhoramento) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[3].outrosInvestimentos) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[3].softwares) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[3].intangivel) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[3].total) + '</small></p>' +
        '  </td>' +

        '<tr>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>(+) Amortizações</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[4].recuperacao) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[4].melhoramento) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[4].outrosInvestimentos) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[4].softwares) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[4].intangivel) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[4].total) + '</small></p>' +
        '  </td>' +
        '</tr>' +

        '<tr>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>(-) Margem de Construção</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[5].recuperacao) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[5].melhoramento) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[5].outrosInvestimentos) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[5].softwares) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[5].intangivel) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[5].total) + '</small></p>' +
        '  </td>' +

        '<tr>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>(-) Capitalização de Juros</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[6].recuperacao) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[6].melhoramento) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[6].outrosInvestimentos) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[6].softwares) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[6].intangivel) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[6].total) + '</small></p>' +
        '  </td>' +

        '<tr>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>(-) Adiantamento a Fornecedores</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[7].recuperacao) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[7].melhoramento) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[7].outrosInvestimentos) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[7].softwares) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[7].intangivel) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[7].total) + '</small></p>' +
        '  </td>' +

        '<tr>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>(-) Invest. Em Infraestrutura a Realizar</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[8].recuperacao) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[8].melhoramento) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[8].outrosInvestimentos) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[8].softwares) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[8].intangivel) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[8].total) + '</small></p>' +
        '  </td>' +

        '<tr>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>(=) Invest - SF</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[9].recuperacao) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[9].melhoramento) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[9].outrosInvestimentos) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[9].softwares) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[9].intangivel) + '</small></p>' +
        '  </td>' +
        '  <td style="border-right: 1px solid #3a3a3a">' +
        '    <p><small>' + formatMoney(d.modalidades[9].total) + '</small></p>' +
        '  </td>' +

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
            lengthMenu:"Registros por página _MENU_ ",
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
        columnDefs: [
            {
                targets: [-1],
                searchable: false,
                orderable: false,
                defaultContent: '<a href="#" class="icon-export" title="Exportar"><i class="fas fa-print"></i> <span class="sr-only">Exportar</span></a>'
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
                "width": '10%'
            },
            {
                title: 'CNPJ',
                width: '20%',
                data: 'cnpj',
                render: function (data) {
                    return data.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                }
            },
            {
                title: 'Razão Social',
                width: '30%',
                data: 'razaoSocial'
            },
            {
                title: 'Mês/Ano Referência',
                width: '15%',
                data: 'mesAnoReferencia'
            },
            {
                title: 'Data de Envio',
                width: '32%',
                data: 'dataEnvio',
                render: function (data) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                title: 'Exportar',
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

    form.submit(function (event) {
        if (event.target.action.indexOf("Excel") >= 0)
            return true;

        event.preventDefault();

        if (!validateForm())
            return false;

        //trocar dia e mês antes de serializar
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

    var $resultado = $('#resultado tbody');
    var codigoExportar = 17;
    $resultado.on('click', 'a.icon-export', function () {
        var data = dt.row($(this).parents('tr')).data();
        $('#modal_demand').modal('show'); 
        codigoExportar = data.codigo;
    });

    $('#btnExportar').click(function () {
        valor = $('input[name=radioExportar]:checked', '#myFormExportar').val();
        if (valor == 'pdf') {
            exportarPdf();
        } else if (valor == 'excel') {
            exportarExcel();
        } else {
            toastr.warning("Selecione uma opção para exportação.");
        }
    });

    function exportarPdf() {
        $("#modal_demand").modal("hide");
        window.open($.UrlRootPath + '/EvolucaoInvestimento/ExportarPdfEvolucaoInvestimento?codigo=' + codigoExportar);
    }
    function exportarExcel() {
        $("#modal_demand").modal("hide");
        window.open($.UrlRootPath + '/EvolucaoInvestimento/ExportarExcelEvolucaoInvestimento?codigo=' + codigoExportar);
    }
});
