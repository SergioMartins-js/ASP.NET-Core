var antt = antt || {};
antt.siref = antt.siref || {};
antt.siref.cadastro_em_lote = {
    Init: function (link, title, url) {
        $("#linkTemplate").attr("href", $.UrlRootPath + link);
            $("#modal_demand-title").html(title);
            $("#fileUpload").change(function () {
                var file = $("input#fileUpload")[0].files[0];
                if (file.size > 5242880 || file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    $("#fileUpload").val("");
                    $("#nomeArquivo").html("");
                    toastr.warning("O arquivo informado é inválido, favor anexar um arquivo no formato CSV com tamanho máximo de 5Mb.")
                }
                else {
                    $("#nomeArquivo").html(file.name);
                }
            });

            $("#btnExportarLote").on("click", function () {
                var formData = new FormData();
                formData.append("FileUpload", $("input#fileUpload")[0].files[0]);
                $.ajax({
                    type: "POST",
                    url: url,
                    data: formData,
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.Success) {
                            toastr.success(data.Msg)
                            $("#modal-upload").modal("hide");
                        }
                        else {
                            toastr.error(data.Msg)
                        }
                    }
                });
            });
    }
};