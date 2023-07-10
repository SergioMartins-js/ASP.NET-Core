$(document).ready(function() {
    applyMask ($('main'));
});

function applyMask (container){
    // TELEFONE
    container.find('.mask-tel').mask('(00) 0000-00009',{clearIfNotMatch: true});

    // DATE
    container.find('.mask-date').mask('00/00/0000',{clearIfNotMatch: true});

    // DATE - HOUR
    container.find('.mask-dateTime').mask('00/00/0000 00:00',{clearIfNotMatch: true});

    // NÚMERO
    container.find('.mask-number').mask('#');

    //MOEDA
    container.find('.money').mask('000.000.000.000.000,00', { reverse: true });

    //CPF
    container.find('.cpf').mask('000.000.000-00', { reverse: true });

    //CEP
    container.find('.cep').mask('00000-000');

    //CNPJ
    container.find('.mask-cnpj').mask('00.000.000/0000-00', { reverse: true });
    container.find('.mask-contaContabil').mask("0.0.0.00.00.000", { reverse: true });
    //ONLY CHAR
    container.find('.only-digits').mask('S',
        {
            'translation':
            {
                S:
                {
                    pattern: /[A-Za-z ]/,
                    recursive: true
                },
            }, maxlength: false
        }
    );
    //ONLY NUNMBER
    container.find('.only-numbers').mask('S',
        {
            'translation':
            {
                S:
                {
                    pattern: /[^A-Za-z ]/,
                    recursive: true
                },
            }, maxlength: false
        }
    );
}
