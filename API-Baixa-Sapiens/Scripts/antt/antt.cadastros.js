antt = antt || {};
antt.cadastros = {
    Options: {
        FormId: 'form-dados',
        BaseUrl: '',
    },
    Init: function (options) {
        var self = antt.cadastros;

        options = options || {}
        self.Options.BaseUrl = options.baseUrl || $.CurrentController;
        self.Options.FormId = options.formID || self.Options.FormId;

        //voltar
        $('.btn-voltar').on('click', function () {
            self.Voltar();
        });

        //salvar formulario
        $('.btn-salvar').on('click', function () {
            self.Salvar();
        });

        //ativar
        $('*[name="btnSituacaoAtivar"]').on('click', function () {
            self.Situacao.Ativar();
        });

        //inativar
        $('*[name="btnSituacaoDesativar"]').on('click', function () {
            self.Situacao.Inativar();
        });

        //situacao
        $('.situcao').on("ifChanged", function () {
            if (this.value === "false") {
                $('.data-inativacao').val(Data());
            }
            else {
                $('.data-inativacao').val('');
            }
        });

        //excluir
        $(document).on('click', 'a.cmd-excluir', function () {
            var $this = $(this);
            self.Excluir($this.data('action-delete'), $this.data('keys'));
        });
    },
    Salvar: function () {
        var self = antt.cadastros;
        if ($('#' + self.Options.FormId).valid()) {

            var data = $('#' + self.Options.FormId).serialize();

            BlockUI();
            //chama Método salvar
            $.ajax({
                data: data,
                type: 'POST',
                cache: false,
                url: $('#' + self.Options.FormId).prop('action'),
                success: function (data) {
                    try {
                        if (data.value === true) {
                            //é atualização de dados,
                            //então volta pra tela de consulta com dados carregados
                            if (data.msg === "Registro alterado com sucesso!")
                                $(location).attr('href', $.UrlRootPath + self.Options.BaseUrl + '?voltar=1');
                            else
                                $(location).attr('href', $.UrlRootPath + self.Options.BaseUrl + '/Index?msg=' + data.msg);
                        }
                        else {
                            if (data.msg === "Dado(s) Inválido(s)!") {
                                ModelInvalidate(data);
                            }
                            else {
                                toastr.error(data.msg);
                            }
                        }
                    }
                    catch (exc) {
                        UnBlockUI();
                        toastr.error(data.msg)
                    }
                    finally {
                        UnBlockUI();
                    }
                },
                error: function (data) {
                    UnBlockUI();
                    toastr.error(data.msg)
                }
            });
        }
    },
    Situacao: {
        Ativar: function () {
            var self = antt.cadastros;

            var msg = $.MSG_A002;
            var codigo = $('#Codigo').val();
            Confirm(msg, 'Ativar', function () {
                self.Situacao.Alterar(codigo, true, function () {
                    $(location).attr('href', $.UrlRootPath + self.Options.BaseUrl + '?voltar=1');
                });
            });
        },
        Inativar: function () {
            var self = antt.cadastros;

            var msg = $.MSG_A001;
            var codigo = $('#Codigo').val();
            Confirm(msg, 'Inativar', function () {
                self.Situacao.Alterar(codigo, false, function () {
                    $(location).attr('href', $.UrlRootPath + self.Options.BaseUrl + '?voltar=1');
                });
            });
        },
        Alterar: function (codigo, situacao, onSuccess, onError) {
            var self = antt.cadastros;

            var data = { id: codigo, situacao: situacao }

            BlockUI();
            //chama Método salvar
            $.ajax({
                data: data,
                type: 'POST',
                cache: false,
                url: $.UrlRootPath + self.Options.BaseUrl + '/AlterarSituacao',
                success: function (data) {
                    try {
                        if (data.value === true) {
                            Mensagem(data.msg, "Sucesso!", function () {
                                if (onSuccess)
                                    onSuccess();
                            });
                        }
                        else {
                            if (data.msg === "Dado(s) Inválido(s)!") {
                                ModelInvalidate(data);
                            }
                        }
                    }
                    catch (exc) {
                        UnBlockUI();
                        Mensagem(data.msg, "Erro!", function () {
                            if (onError)
                                onError(exc);
                        });
                    }
                    finally {
                        UnBlockUI();
                    }
                },
                error: function (data) {
                    UnBlockUI();

                    Mensagem(data.msg, "Erro!", function () {
                        if (onError)
                            onError(data.msg);
                    });
                }
            });
        }
    },
    Voltar: function () {
        var self = antt.cadastros;
        var msg = $.MSG_A003;

        Confirm(msg, 'Voltar', function () {
            $(location).attr('href', $.UrlRootPath + self.Options.BaseUrl + '?voltar=2');
        });
    },
    Excluir: function (url, data) {
        var self = antt.cadastros;

        Confirm($.MSG_A004, 'Excluir', function () {
            $.ajax({
                data: data,
                type: 'POST',
                url: url,
                beforeSend: function () {
                    BlockUI();
                }
            })
                .done(function (data) {
                    if (data.value === true) {
                        $(location).attr('href', $.UrlRootPath + self.Options.BaseUrl + '?voltar=3');
                    }
                    else {
                        Mensagem(data.msg, "Erro!");
                    }
                })
                .fail(function (data) {
                    Mensagem(data.msg, "Erro!");
                })
                .always(function () {
                    UnBlockUI();
                });
        });
    }
}

$(document).ready(function () {
    //inicia ferramentas de form
    antt.cadastros.Init();
});