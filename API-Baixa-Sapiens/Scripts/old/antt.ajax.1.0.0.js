(function(antt, $) {

    antt.ajax = {
        configure: function(event, xhr, options) {

            $("form").removeData("validator");
            $("form").removeData("unobtrusiveValidation");
            $.validator.unobtrusive.parse("form");

            $("[data-ajaxupdate-url]").change(function(e) {

                e.stopImmediatePropagation();
                var self = $(this);

                // para requisição
                var url = self.attr("data-ajaxupdate-url");
                var method = self.attr("data-ajaxupdate-method");

                // para atualização depois de selecionar o item
                var targetid = self.attr("data-ajaxupdate-targetid");

                // recupera o formulário com os dados
                var form = self.closest("form");

                // atualiza o html
                $.ajax({
                    url: url,
                    method: method || "POST",
                    data: form.serializeArray(),
                    success: function(data) {
                        $(targetid).html(data);
                    }
                });

            });

            $("[data-ajaxupdate-url-input-text]").focusout(function() {
                var self = $(this);

                // para requisição
                var url = self.attr("data-ajaxupdate-url-input-text");
                var method = self.attr("data-ajaxupdate-method");

                // para atualização depois de selecionar o item
                var targetid = self.attr("data-ajaxupdate-targetid");

                // recupera o formulário com os dados
                var form = self.closest("form");

                // atualiza o html
                $.ajax({
                    url: url,
                    method: method || "POST",
                    data: form.serializeArray(),
                    success: function(data) {
                        $(targetid).html(data);
                    }
                });

            });

            $("[data-ajaxload-url]").each(function() {

                var self = $(this);

                if (!self.attr("data-ajaxload-load")) {

                    self.attr("data-ajaxload-load", true);

                    // para requisição
                    var url = self.attr("data-ajaxload-url");
                    var method = self.attr("data-ajaxload-method");

                    // atualiza o html
                    $.ajax({
                        url: url,
                        method: method || "GET",
                        success: function(data) {
                            self.html(data);
                        }
                    });
                }

            });

            if (xhr) {

                // redirect ajax and json
                var contentType = xhr.getResponseHeader("content-type") || "";

                // error handling
                if (xhr.status === 500) {
                    // html content?
                    if (contentType.indexOf("html") > -1) {
                        // replace the page
                        $("body").html(xhr.responseText);
                    }
                    // json content?
                    else if (contentType.indexOf("json") > -1) {
                        // show in error message div
                        var data = $.parseJSON(xhr.responseText);
                        if (data && data.error) {
                            var errorwindow = $("#div-shared-messages");
                            errorwindow.find("#span-message-placeholder").text(data.error);
                            errorwindow.removeClass("hide");
                        }
                    }
                } else {
                    // html content?
                    if (contentType.indexOf("html") > -1) {
                        // search for update json
                        var targetsPanel = $("#ajax-update-targets");
                        if (targetsPanel.length == 1) {
                            var targets = JSON.parse(targetsPanel.html());
                            targetsPanel.remove();
                            if (targets && targets.length > 0) {
                                $.each(targets,
                                    function() {
                                        var target = this;
                                        $.ajax({
                                            url: target.redirectUrl,
                                            type: "GET"
                                        }).done(function(data) {
                                            $(target.targetId).html(data);
                                        });
                                    });
                            }
                        }
                    }
                    // json? try redirect
                    else if (contentType.indexOf("json") > -1) {
                        var data = $.parseJSON(xhr.responseText);
                        if (data) {
                            if (data.redirect) {
                                if (data.update) {
                                    var ajaxCallback = $.Deferred();
                                    var modalCallback = $.Deferred();
                                    $.when(ajaxCallback, modalCallback).done(function(ajaxResult) {
                                        $(data.update).html(ajaxResult);
                                    });
                                    $.ajax({
                                        url: data.redirect,
                                        type: "GET"
                                    }).done(function(data) {
                                        ajaxCallback.resolve(data);
                                    }).fail(function() {
                                        ajaxCallback.reject();
                                    });
                                    var modal = $(".modal");
                                    if (modal.length == 0) {
                                        modalCallback.resolve();
                                    } else {
                                        modal.on("hidden.bs.modal",
                                            function(e) {
                                                modalCallback.resolve();
                                            }).modal("hide");
                                    }
                                } else {
                                    window.location.href = data.redirect;
                                }
                            }
                        }
                    }
                }
            }
        },

        blockui: function(element) {
            var optFullPage = {
                message:
                    '<div class="img-loading"></div><p style="text-align: center; margin-top: 5px;">Aguarde</p>',
                css: {
                    border: "none",
                    padding: "30px",
                    backgroundColor: "#1F426A",
                    '-webkit-border-radius': "10px",
                    '-moz-border-radius': "10px",
                    opacity: 0.9,
                    color: "#FFF",
                    'z-index': 99999
                }
            };
            var optElement = {
                message:
                    '<div class="img-loading-sm"></div>',
                css: {
                    border: "none",
                    backgroundColor: "transparent",
                    opacity: 0.9,
                    color: "#000",
                    'z-index': 99999
                },
                overlayCSS: {
                    backgroundColor: "#000",
                    opacity: 0.0,
                    cursor: "wait"
                }
            };
            if (element) {
                var parent = $(element);

                if (!parent.is("div")) {
                    parent = parent.closest("div");
                }

                parent.attr("data-blocked", true).block(optElement);
            } else {
                $.blockUI(optFullPage);
            }
        },

        unblockui: function() {
            $("[data-blocked]").removeAttr("data-blocked").unblock();
            $.unblockUI();
        }

    };

})(window.antt = window.antt || {}, jQuery);

$(function() {
    antt.ajax.configure();
    $(document).ajaxComplete(function(event, xhr, options) {
        antt.ajax.unblockui();
        antt.ajax.configure(event, xhr, options);
    });
    $(document).ajaxSend(function(event, jqxhr, settings) {
        antt.ajax.blockui(settings.blockelement);
    });
    //$(document).ajaxSuccess(function (event, xhr, settings) {
    //    if (settings.mvcTargetElement) {
    //        $(settings.mvcTargetElement.getAttribute("data-ajax-update")).each(function () {
    //            $.validator.unobtrusive.parse(this);
    //        });
    //    }
    //});

});