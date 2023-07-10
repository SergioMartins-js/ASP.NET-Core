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
        dom:  '<"float-right"l>rt<"center"p><"clear">',
        info: false,
        pagingType: "simple_numbers",
        select: {
            selector:'td:not(:first-child)',
            style:    'os'
        },
        columns: [
            {
                title: 'CNPJ',
                width: '15%',
                data: 'cnpj',
                render: function (data) {
                    return data.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                }
            },
            {
                title: 'Razão Social',
                width: '16%',
                data: 'razaoSocial'
            },
            { title: 'Codigo Tipo do Documento', data: 'codigoTipoDocumento', visible: false },
            { title: 'Tipo do Documento', width: '15%', data: 'descricaoTipoDocumento', orderData:[2] },            
            { 
                title: 'Data limite para envio', 
                width: '16%', 
                data: 'dataLimiteEnvio',
            render: function(data){
                return data != null ? moment(data).format('DD/MM/YYYY') : "-";
                }
            },
            {
                title: 'Data da Prorrogação',
                width: '17%',
                data: 'dataProrrogacao',
                render: function(data){
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                title: 'Usuário Aprovador',
                width: '33%',
                data: 'usuario'
            },
            {
                title: 'Data da aprovação',
                width: '17%',
                data: 'dataAprovacao',
                render: function(data){
                    return data != null ? moment(data).format('DD/MM/YYYY') : "-";
                }
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

    form.submit(function (event) {
        if (event.target.action.indexOf("Excel") >= 0 || event.target.action.indexOf("Pdf") >= 0) {
            return true;
        }

        event.preventDefault();

        if (!validateForm())
            return false;

        trocarDiaMes('#PeriodoVigencia_Inicio');
        trocarDiaMes('#PeriodoVigencia_Final');

        dt.ajax.url('ListarRelatorio?' + form.serialize()).load();

        trocarDiaMes('#PeriodoVigencia_Inicio');
        trocarDiaMes('#PeriodoVigencia_Final');

        return true;
    });

    $resultado.on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = dt.row( tr );

        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    });
});

function ValidarData(dataInicio, dataFim) {
    var dtInicio = new Date(moment(dataInicio, "DD/MM/YYYY"));
    var dtFim = new Date(moment(dataFim, "DD/MM/YYYY"));
    if (dataFim != "") {
        if (dtInicio.getTime() > dtFim.getTime()) {
            $('#PeriodoVigencia_Inicio').addClass("error");
            $('#PeriodoVigencia_Final').addClass("error");
            return false;
        }
        else {
            $('#PeriodoVigencia_Inicio').removeClass("error");
            $('#PeriodoVigencia_Final').removeClass("error");
            return true
        }
    }
    else {
        $('#PeriodoVigencia_Inicio').removeClass("error");
        $('#PeriodoVigencia_Final').removeClass("error");
        return true;
    }
}

function validateForm() {
    var cnpj = $('#Cnpj').val();
    var dtInicio = $('#PeriodoVigencia_Inicio').val();
    var dtFim = $('#PeriodoVigencia_Final').val();

    if (cnpj != '' && !CnpjIsValid(cnpj)) {
        toastr.error("CNPJ inválido!");
        return false;
    }
    if (!ValidarData(dtInicio, dtFim)) {
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

function trocarDiaMes(target) {
    var data = $(target).val();
    var diaI = data.substring(0, 2);
    var mesI = data.substring(3, 5);
    data = data.replace(mesI, diaI);
    data = data.replace(diaI, mesI);
    $(target).val(data);
}

function main() {
    $("#TipoDocumento option[value='34']").remove();
}
main();