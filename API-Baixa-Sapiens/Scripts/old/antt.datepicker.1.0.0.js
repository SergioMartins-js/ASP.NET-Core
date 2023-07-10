(function(antt, $) {

    antt.datepicker = {
        configure: function() {
            $(".datepicker").inputmask("99/99/9999",
                {
                    "placeholder": "__/__/____",
                    "clearMaskOnLostFocus": false,
                    "removeMaskOnSubmit": true,
                    onincomplete: function() {
                        $(this).val("");
                    },
                    onUnMask: function(maskedValue, unmaskedValue) {
                        if (unmaskedValue !== "") {
                            return maskedValue;
                        }
                        return unmaskedValue;
                    }
                });
            $(".datepicker").datepicker({
                gotoCurrent: false,
                language: "pt-BR",
                autoclose: true
            });

            //$(".datepicker").on("change", function () {
            //    $.validator.addMethod(
            //        "data-val-invaliddate",
            //        function (value, element) {
            //            return this.optional(element) || isValidDate(value);
            //        },
            //        $(this).attr("data-val-invaliddate")
            //    );

            //    $(this).valid();
            //});

        }

    };

})(window.antt = window.antt || {}, jQuery);


$(function() {
    antt.datepicker.configure();
    $(document).ajaxComplete(function() {
        antt.datepicker.configure();
    });
});