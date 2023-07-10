$(function () {
    $('.diaMes').mask('00/00');

    var form = $('#formConsultarRecepcaoDocumento');
    var dt = $('#resultList').DataTable({
        order: [[1, 'desc']],
        processing: true,
        lengthMenu: [10,20,30],
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
        dom: '<"float-right"l>rt<"center"p><"clear">',
        info: false,
        pagingType: "simple_numbers",
        columnDefs: [
            {
                targets: [-1],
                searchable: false,
                orderable: false,
                defaultContent: '<div class="row"><a href="#" class="icon-edit" title="Editar"><i class= "fas fa-edit" ></i></a>' +
                    '<a href="#" class= "icon-delete" title="Excluir" > <i class="fas fa-trash" ></i></a></div>'
            },
            {
                targets: '_all',
                searchable: false,
                orderable: true,
                defaultContent: '-'
            }
        ],
        columns: [
            {
                title: 'Início da Vigência',
                width: '15%',
                data: 'inicioVigencia',
                render: function (data) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                title: 'Fim da Vigência',
                width: '15%',
                data: 'fimVigencia',
                render: function (data) {
                    return moment(data).isValid() ? moment(data).format('DD/MM/YYYY') : '-';
                }
            },
            { title: 'Codigo Tipo do Documento', data: 'tipoDocumento', visible: false },
            { title: 'Mes Referencia', data: 'mesReferencia', visible: false },
            { title: 'Tipo do Documento', width: '30%', data: 'descricaoTipoDocumento', orderData: [2] },
            { title: 'Mês de Referência', width: '16%', data: 'descricaoMesReferencia', orderData: [3] },
            {
                title: 'Data Limite para Envio',
                width: '17%',
                data: 'dataLimiteEnvio',
                render: function (data) {
                    return moment(data).format('DD/MM');
                }
            },
            {
                title: 'Ações',
                width: '7%',
                data: null
            }
        ],
        fnDrawCallback: function (oSettings) {
            if ($('#resultList tbody tr .dataTables_empty').length == 0) {
                $('#btnExportarExcel').show();
            } else {
                $('#btnExportarExcel').hide();
            }
        }
    });
    
    var $resultList = $('#resultList tbody');
    $resultList.on('click', 'a.icon-edit', function () {
        var data = dt.row($(this).parents('tr')).data();
        window.location = $.UrlRootPath + '/RecepcaoDocumento/Editar/' + data.id;
    });

    $resultList.on('click', 'a.icon-delete', function () {
        var data = dt.row($(this).parents('tr')).data();
        boot4.confirm({
            msg: "Deseja realmente excluir documento?",
            title: "Confirmar",
            callback: function (result) {
                if (result) {
                    $.ajax({
                        url: $.UrlRootPath + '/RecepcaoDocumento/Excluir/',
                        method: "POST",
                        data: { id: data.id }
                    }).done(function (data) {
                        if (data.Success) {
                            dt.row($(this).parents('tr')).remove().draw(false);
                            toastr.success("Ação realizada com sucesso!");
                        }
                        else {
                            toastr.error("Erro ao excutar a Ação desejada!");
                        }
                    });

                    //sendDelete(data.id);
                }
            }
        });
    });

    $("#btnExportarExcel").on('click', function () {
        $("#modal_demand").modal("hide");
        var $formConsultarRecepcaoDocumento = $('#formConsultarRecepcaoDocumento');
        $formConsultarRecepcaoDocumento.attr('action', $.UrlRootPath + '/RecepcaoDocumento/Excel');
        $formConsultarRecepcaoDocumento.attr('method', 'POST');
        $formConsultarRecepcaoDocumento.submit();
        $formConsultarRecepcaoDocumento.attr('action', '#');
        $formConsultarRecepcaoDocumento.attr('method', 'GET');
    });

    form.submit(function (event) {
        if (event.target.action.indexOf("Excel") >= 0) {
            return true;
        }

        event.preventDefault();
        if (!validateForm())
            return false;

        trocarDiaMes('#Vigencia_Inicio');
        trocarDiaMes('#Vigencia_Final');

        dt.ajax.url('Listar?' + form.serialize()).load();

        trocarDiaMes('#Vigencia_Inicio');
        trocarDiaMes('#Vigencia_Final');

        return true;
    });
});

function validateForm() {

    var dtInicio = $('#Vigencia_Inicio').val();
    var dtFim = $('#Vigencia_Final').val();
    var dataLimite = $('#DataLimiteEnvio').val();

    if (dtInicio != '' && dtFim != '' && convertData(dtInicio) > convertData(dtFim)) {
        toastr.error("Data inicial maior que data final.");
        return false;
    }

    if (!mesDiaValidos(dataLimite)) {
        toastr.error("Data limite para envio inválida.");
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

function main() {
    $("#TipoDocumento option[value='34']").remove();
}
main();