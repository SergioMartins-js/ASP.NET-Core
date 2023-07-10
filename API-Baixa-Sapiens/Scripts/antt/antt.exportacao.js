
//var antt = antt || {};

//        options = options || {};
//        self.Options.BaseUrl = options.baseUrl || $.CurrentController;
//        self.Options.FormId = options.formID || 'form-consulta';

//        if ($("#dialogExportar").length > 0) {

//            //$('#dialogExportar').addClass('dialog');

////            $('#dialogExportar').removeClass('programmatic');

//            self.DialogExportar = $("#dialogExportar").dialog({
//                autoOpen: false,
//                height: 170,
//                width: 350,
//                modal: true,
//                buttons:
//                    [
//                        {
//                            text: "Exportar",
//                            "class": 'btn',
//                            click: function () {
//                                self.Options.tipo = $('#cboExportar').val();
//                                self.Exportar(function () {
//                                    $('#dialogExportar').dialog("close");
//                                });
//                            }
//                        },
//                        {
//                            text: "Fechar",
//                            "class": 'btn',
//                            click: function () {
//                                $(this).dialog("close");
//                            }
//                        }
//                    ],
//                create: function () {
//                    $(this).closest(".ui-dialog")
//                        .find(".ui-dialog-buttonset")
//                        .addClass("modal-imprimir-buttons");
//                }
//            });
//        };
//    },
//    Exportar: function (callback) {
//        var self = antt.exportacao;

//        var queryString = $("#" + self.Options.FormId).serialize();

//        switch (self.Options.tipo) {

//            case "pdf":
//                window.open($('.btn-imprimir').attr('data-href-pdf'));
//                break;
//            case "excel":
//                window.open($('.btn-imprimir').attr('data-href-excel'));
//                break;
//            default:
//                break;
//        }

//        if (self.Options.tipo === '') {
//            Mensagem($.MSG_E010);
//        }
//        else {
//            callback();
//        }
//    },
//    ShowDialog: function () {
//        var self = antt.exportacao;

//        $('#cboExportar').val('');
//        self.Options.tipo = '';
//        self.DialogExportar.dialog("open");
//    }
//};

//$(document).ready(function () {
//    //inicia exportacao
//    antt.exportacao.Init();
//});