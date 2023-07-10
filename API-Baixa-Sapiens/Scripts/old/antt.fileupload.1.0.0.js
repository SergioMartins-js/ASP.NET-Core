(function(antt, $) {

    antt.fileupload = {
        configure: function() {

            var deleteUploadedFile = function(container, callback) {

                var id = container.find("[data-fileupload-property=Id]").val();
                var tempId = container.find("[data-fileupload-property=TempId]").val();

                var url = container.find("[data-fileupload-delete-url]").attr("data-fileupload-delete-url") +
                    "?id=" +
                    tempId;

                if (!(id && id != "") && tempId && tempId != "") {

                    $.ajax({
                        url: url,
                        type: "POST",
                        success: function(data) {

                            callback();

                        }
                    });

                } else {

                    callback();

                }

            };

            $("input[type=file]").each(function() {

                var self = $(this);

                if (self.attr("data-fileupload-url-ok")) {
                    return;
                }

                self.attr("data-fileupload-url-ok", true);

                var url = self.attr("data-fileupload-url");

                var acceptFileTypes = self.attr("data-fileupload-acceptfiletypes");
                var maxfilesize = self.attr("data-fileupload-maxfilesize");
                var minfilesize = self.attr("data-fileupload-minfilesize");

                var container = self.parent().parent();

                self.fileupload({
                    paramName: "file",
                    url: url,
                    add: function(e, data) {

                        var errorMessage = container.find("[data-fileupload-errormessage]");

                        if (acceptFileTypes &&
                            data.originalFiles[0]["name"].length &&
                            !(new RegExp(acceptFileTypes, "i")).test(data.originalFiles[0]["name"])) {
                            errorMessage.text(errorMessage.attr("data-fileupload-acceptfiletypes") ||
                                "Tipo de extensão inválida");
                        } else if (maxfilesize &&
                            data.originalFiles[0]["size"] &&
                            data.originalFiles[0]["size"] > maxfilesize) {
                            errorMessage.text(
                                errorMessage.attr("data-fileupload-maxfilesize") || "Arquivo muito grande");
                        } else if (minfilesize &&
                            data.originalFiles[0]["size"] &&
                            data.originalFiles[0]["size"] < minfilesize) {
                            errorMessage.text(errorMessage.attr("data-fileupload-minfilesize") ||
                                "Arquivo muito pequeno");
                        } else {
                            errorMessage.text("");
                            data.submit();
                        }

                    },
                    success: function(data) {

                        // exclui o arquivo anterior

                        deleteUploadedFile(container,
                            function() {

                                // atualiza os hidden fields

                                container.find("[data-fileupload-property]").each(function() {

                                    var field = $(this);
                                    var property = field.attr("data-fileupload-property");
                                    var value = data[property];
                                    if (field.is("input")) {
                                        field.val(value);
                                    } else {
                                        field.text(value);
                                    }

                                });

                            });

                    }
                }).bind("fileuploadprocessfail",
                    function(e, data) {
                        alert(data.files[data.index].error);
                    });

            });

            $("[data-fileupload-download-url]").click(function(event) {

                event.preventDefault();

                var btn = $(this);
                var container = btn.parent();

                var url = btn.attr("data-fileupload-download-alternative-url");
                var id = container.find("[data-fileupload-property=Id]").val();

                if (!(id && id != "" && url && url != "")) {

                    url = btn.attr("data-fileupload-download-url");
                    id = container.find("[data-fileupload-property=TempId]").val();

                }

                window.open(url + "?id=" + id);
            });

            $("[data-fileupload-delete-url]").click(function(event) {

                event.preventDefault();

                var container = $(this).parent();

                deleteUploadedFile(container,
                    function() {

                        // atualiza os hidden fields

                        container.find("[data-fileupload-property]").each(function() {

                            var field = $(this);
                            var property = field.attr("data-fileupload-property");
                            if (field.is("input")) {
                                field.val("");
                            } else {
                                field.text("");
                            }

                        });

                        var span = container.find(".span-filename");
                        span.text(span.attr("data-fileupload-text"));

                    });

            });
        }

    };

})(window.antt = window.antt || {}, jQuery);

$(function() {

    antt.fileupload.configure();
});

$(document).ajaxComplete(function() {
    antt.fileupload.configure();
});