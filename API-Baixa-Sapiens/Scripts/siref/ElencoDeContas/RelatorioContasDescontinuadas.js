$(function () {
    var form = $('#Relatorio');
    var dt = $('#resultado').DataTable({
        order: [[0, 'asc']],
        processing: true,
        lengthMenu: [10, 20, 30],
        serverSide: true,
        autoWidth: false,
        scrollX: false,
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
        info: true,
        pagingType: "simple_numbers",
        select: {
            selector:'td:not(:first-child)',
            style:    'os'
        },
        columns: [
            { title: 'DenominaçãoLivre', data: 'isDenominacaoLivre', visible: false },
            { title: 'InicioVigencia', data: 'inicioVigencia', visible: false },
            { title: 'FimVigencia', data: 'fimVigencia', visible: false },
            {
                title: 'Nível da Conta',
                data: 'nivelConta'
            },
            {
                title: 'Descrição',
                data: 'sistema',
                render: function (data) {
                    switch (data) {
                        case 1:
                            return "Ativo";
                        case 2:
                            return "Passivo";
                        case 3:
                            return "Receitas";
                        case 4:
                            return "Custos";
                        case 5:
                            return "Despesas e Demais Resultados";
                    }
                }
            },
            {
                title: 'Natureza',
                data: 'natureza'
            },
            {
                title: 'Período de Vigência',
                data: 'vigencia',
                orderData:[1,2]
            },
            {
                title: 'Denominação Livre',
                data: 'denominacaoLivre',
                orderData: [0]
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
});
function exportarArquivo(url) {
    $("#modal_demand").modal("hide");
    var form = $('#Relatorio');
    form.attr('action', url);
    form.attr('method', 'POST');
    form.submit();
    form.attr('action', '#');
    form.attr('method', 'GET');
}

function validateForm() {
    var dtInicio = $('#PeriodoVigencia_Inicio').val();
    var dtFim = $('#PeriodoVigencia_Final').val();
    var conta = $('#ContaContabil').val();
    
    if (dtInicio != '' && dtFim != '' && convertData(dtInicio) > convertData(dtFim)) {
        toastr.warning("Período de Vigência inválido!");
        return false;
    }
    if (!dataValida(dtInicio)) {
        toastr.warning("Data inválida!");
        return false;
    }
    if (!dataValida(dtFim)) {
        toastr.warning("Data inválida!");
        return false;
    }
    if (conta != '' && !ContaContabilIsValid(conta)) {
        toastr.warning("Conta Contábil inválida!");
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