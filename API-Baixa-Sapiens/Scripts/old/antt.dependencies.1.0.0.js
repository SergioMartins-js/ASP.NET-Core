(function(antt, $) {

    antt.dependencies = {
        configure: function() {

            $("[data-depends-on]").each(function() {
                var self = $(this);

                var done = self.attr("data-depends-done");

                if (!done) {

                    self.attr("data-depends-done", true);

                    var dependencies = self.attr("data-depends-on");
                    var dependencieValue = self.attr("data-depends-value") || "notempty";
                    var dependencieMode = self.attr("data-depends-mode") || "show";
                    var dependencieNotValue = self.attr("data-depends-not") || "false";

                    $(dependencies).change(function() {

                        var ok = dependencieValue == "notempty" || dependencieValue == "empty";

                        $(dependencies).each(function() {

                            var dependencyElement = $(this);

                            if (dependencyElement.is(":checkbox,:radio") && !dependencyElement.is(":checked")) {
                                return;
                            }

                            var value = dependencyElement.val();
                            if (dependencieValue == "notempty") {
                                if (value && value != "") {
                                    ok = ok && true;
                                } else {
                                    ok = false;
                                }
                            } else if (dependencieValue == "empty") {
                                if (value && value != "") {
                                    ok = false;
                                } else {
                                    ok = ok && true;
                                }
                            } else if (dependencieNotValue == "true") {
                                if (value && value != dependencieValue) {
                                    ok = true;
                                } else {
                                    ok = ok || false;
                                }
                            } else {
                                if (value && value == dependencieValue) {
                                    ok = true;
                                } else {
                                    ok = ok || false;
                                }
                            }

                        });

                        if (ok) {
                            if (dependencieMode == "show") {
                                self.show();
                            } else if (dependencieMode == "enable") {
                                self.prop("readonly", false);
                            } else if (dependencieMode == "visibility") {
                                self.css("visibility", "");
                            }
                        } else {
                            if (dependencieMode == "show") {
                                self.hide();
                            } else if (dependencieMode == "enable") {
                                self.prop("readonly", true);
                            } else if (dependencieMode == "visibility") {
                                self.css("visibility", "hidden");
                            }
                        }

                    }).change();
                }

            });

        }
    };

})(window.antt = window.antt || {}, jQuery);

$(function() {
    antt.dependencies.configure();
    $(document).ajaxComplete(function() {
        antt.dependencies.configure();
    });
});