$(function() {

    $(document).on("change",
        "[data-sum-operator]",
        function() {

            var group = $(this).data("sum-operator");

            var total = 0.0;


            $("[data-sum-operator='" + group + "']").each(function() {

                var val = $(this).val();

                var number = parseFloat(val.replace(new RegExp("[.]", "g"), "").replace(",", "."));
                if (!isNaN(number)) {
                    total += number;
                }

            });
            var digitos = $(this).data("sum-digits");
            if (digitos == null) {
                digitos = 0;
            }

            $("[data-sum-result='" + group + "']").val(formataDecimal(total, digitos));
        });

    function formataDecimal(valor, digitos) {
        var formato = { minimumFractionDigits: digitos, maximumFractionDigits: digitos };
        return valor.toLocaleString("pt-BR", formato);
    }

});