$(document).ready(function() {

    // DEFAULT OPTIONS
    var options = {
        inline: true,
        format: 'L'
    }

    // SIMPLE DATE
    var inline_date = $('#mainAside').find('.inline_datepicker');
    apply_datepicker(inline_date, options);

    // PICK A DATE
    inline_date.on('change.datetimepicker', function(e) {
        console.log('Realizar uma requisição AJAX para mostrar os resultados referentes à data '+e.date)
    });

    // TASK MODAL
    $('#modal_task').on('show.bs.modal', function (e) {
        var modal = $(e.target),
              button = $(e.relatedTarget);

        if(!button.is('button')){
            var info_ref = button.siblings('.item-info');
            modal.find('#modal_task-title').text('Editar').end()
                 .find('#modal_task-dataInicial').val(info_ref.find('.ref-data_inicial').val()).end()
                 .find('#modal_task-dataFinal').val(info_ref.find('.ref-data_final').val()).end()
                 .find('#modal_task-id').val(info_ref.find('.ref-id').val()).end()
                 .find('#modal_task-desc').val(info_ref.find('.ref-desc').val()).end()
                 .find('#modal_task-titleTask').val(info_ref.find('.ref-title').val());
        }
    }).on('hidden.bs.modal', function (e) {
        $(e.target).find('#modal_task-title').text('Adicionar').end()
                   .find('.form-control').val('');
    }).find('.saveTask').click(function(e) {
        console.log('Realizar uma requisição AJAX para salvar os dados do formulário '+ $(this).closest('form').serialize() +' na tarefa '+ $('#modal_task-id').val() +' e recarregar a lista de tarefas');
        $('#modal_task').modal('hide');
    });
});