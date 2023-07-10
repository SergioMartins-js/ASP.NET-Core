(function(antt, $) {

    antt.enumdropdownlist = {
        configure: function() {
            $(".enumdropdownlist").each(function(index, obj) {

                var self = $(this);
                var selected = self.val(); // cache selected value, before reordering
                var opts_list = self.find("option").clone();
                opts_list.sort(function(a, b) { return $(a).text() > $(b).text() ? 1 : -1; });
                self.html("").append(opts_list);
                self.val(selected); // set cached selected value               
            });
        }

    };

})(window.antt = window.antt || {}, jQuery);


$(function() {
    antt.enumdropdownlist.configure();
    $(document).ajaxComplete(function() {
        antt.enumdropdownlist.configure();
    });
});