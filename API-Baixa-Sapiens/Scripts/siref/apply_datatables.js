﻿$.extend(true, $.fn.dataTable.defaults, {
    searching: false,
    language: {
        emptyTable: 'Nenhum registro encontrado',
        info: 'Mostrando de _START_ até _END_ de _TOTAL_ registros',
        infoEmpty: 'Mostrando 0 até 0 de 0 registros',
        infoFiltered: '(Filtrados de _MAX_ registros)',
        infoPostFix: '',
        lengthMenu: '_MENU_ registros por página',
        loadingRecords: 'Carregando...',
        processing: 'Processando...',
        zeroRecords: 'Nenhum registro encontrado',
        search: 'Pesquisar',
        paginate: {
            next: 'Próximo',
            previous: 'Anterior',
            first: 'Primeiro',
            last: 'Último'
        },
        aria: {
            sortAscending: ': Ordenar colunas de forma ascendente',
            sortDescending: ': Ordenar colunas de forma descendente'
        }
    }
});
