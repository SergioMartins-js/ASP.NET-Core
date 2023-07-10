(function(antt, $) {

    antt.modal = {
        show: function(boxId, callback) {
            $(boxId).modal();

            if (callback) {
                $(boxId).on("hidden.bs.modal",
                    function() {
                        callback();
                    });
            }
        },

        close: function(boxId, callback) {
            $(boxId).modal("toggle");
            if (callback) {
                callback();
            }
        }
    };

})(window.antt = window.antt || {}, jQuery);