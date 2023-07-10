// VALIDAR FORM
$(document).ready(function() {
    
    // MENSAGEM DE VALIDAÇÃO
    $.validator.messages.required = '* Campo obrigatório';
    $.validator.messages.email = '* Informe um formato de e-mail válido';
    $.validator.messages.equalTo = '* Os valores informados são diferentes';
    $.validator.messages.max = '* Valor máximo excedido';

    // VALIDATE FORM
    $('.validateForm').each(function(){
        validateForm ($(this));
    });
});


    // VALIDATE FORM
function validateForm(jThis) {
    jThis.validate({
        onfocusout: false,

        invalidHandler: function(event, validator) {
            toastr.warning(validator.errorList[0].message);
        },
        errorPlacement: function(error, element) {
            error.prependTo( element.parent() );
        }
    });
}
