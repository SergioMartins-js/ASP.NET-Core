$(function() {
    var form = $('#consultaForm');
    
    var dt = $('#resultado').DataTable({
        order: [[2, "asc"]],
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
        columnDefs: [
            {
                targets: [-1],
                searchable: false,
                orderable: false,
                defaultContent: '<button class="btn btn-sm">Analisar</button>'
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
                title: 'CNPJ',
                width: '14%',
                data: 'cnpj',
                render: function(data) {
                    return data.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                }
            },
            { title: 'Razão Social', width: '20%', data: 'razaoSocial' },
            { title: 'Mês/Ano de Referência', width: '14%', data: 'mesAnoReferencia' },
            { title: 'Codigo Tipo do Documento', data: 'codigoTipoDocumento', visible: false },
            {
                title: 'Tipo do Documento',
                width: '10%',
                data: 'descricaoTipoDocumento',
                render: function(data, type, row) {
                    return '<span title="' + row.tipoDocumento + '">' + data + '</span>';
                },
                orderData: [3]
            },
            { 
                title: 'Situação', 
                width: '10%', 
                data: 'situacaoPrazo'
            },
            {
                title: 'Data da Prorrogação',
                width: '14%',
                data: 'dataProrrogacao',
                render: function(data) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                title: 'Ações',
                width: '5%',
                data: null
            }
        ]
    });

    $('#resultado tbody').on('click', 'button', function() {
        var data = dt.row($(this).parents('tr')).data();
        window.location = $.UrlRootPath  + '/ProrrogacaoPrazo/Analisar/' + data.codigo;
    });

    form.submit(function(event) {
        event.preventDefault();
        var cnpj = $("#Cnpj").val();
        if (cnpj != "") {
            if (!CnpjIsValid(cnpj)) {
                toastr.warning("Campo Cnpj inválido.");
                $("#Cnpj").addClass("error");
                return false;
            }
        }
        dt.ajax.url('Listar?' + form.serialize()).load();
        return true;
    });

    $("#Cnpj").on("keyup", function () {
        $(this).removeClass("error");
    });

    if($("#SituacaoPrazo").val())
    {
        form.submit();
    }
});

$(document).ready(function () {
    $("#CodigoTipoDocumento option[value='34']").remove();
});