
var gerenciar_concessionaria = {

    Init: function () {
        var self = gerenciar_concessionaria;
        $('#DataInicio').val('');
        $('#DataFinal').val('');
        $("#CNPJ").blur(function () {
            var cnpj = $('#CNPJ').val();
            cnpj = helper.removerMascaraCnpj(cnpj);
            if (cnpj.length == 14) {
                self.ConsultarCnpj(cnpj);
            }
        });
        $("#btnNaoConfirmarTransferencia").click(function () {
            $('#CNPJ').val(null);
            $('#Transferencia').val(false);
            $('#dadosTransferencia').css("display", "none");
            $('#CNPJTransferencia').val(null);
            $("#CNPJTransferencia").prop("disabled", false);
            $('#RazaoSocialTransferencia').val(null);
            $("#RazaoSocialTransferencia").prop("disabled", false);
            $('#modal_confirmacao_transferencia').modal('hide');
        });
    },
    ConsultarCnpj: function (_cnpj) {
        $.ajax({
            type: "GET",
            url: 'ConsultarCnpj',
            data: {
                cnpj: _cnpj
            },
            success: function (razaoSocial) {
                if (!razaoSocial) {
                    $('#Transferencia').val(false);
                    $('#dadosTransferencia').css("display", "none");
                    $('#CNPJTransferencia').val('');
                    $('#RazaoSocialTransferencia').val('');
                } else {
                    $('#modal_confirmacao_transferencia').modal('show');
                    $("#btnConfirmarTransferencia").click(function () {
                        $('#Transferencia').val(true);
                        $('#dadosTransferencia').css("display", "block");
                        $('#CNPJTransferencia').val(helper.adicionarMascaraCnpj(_cnpj.toString()));
                        $("#CNPJTransferencia").prop("disabled", true);
                        $('#RazaoSocialTransferencia').val(razaoSocial);
                        $("#RazaoSocialTransferencia").prop("disabled", true);
                        $('#modal_confirmacao_transferencia').modal('hide');
                    });
                }
                $('#loading_screen').hide();
            }
        });
    },
    ExcluirConcessionaria: function () {
        var _id = $('#ConcessionariaCorrente').val()
        $.ajax({
            type: "POST",
            url: 'Excluir',
            data: {
                id: _id
            },
            success: function (data) {
                $('#modal_confirmacao_exclusao').modal('hide');
                if (data.Success) {
                    toastr.success(data.Msg);
                }
                else {
                    toastr.error(data.Msg);
                }

                function explode() {
                    location.reload();
                }
                setTimeout(explode, 3000);
            }
        });
    },
    AutocompleteRazaoSocial: function () {
        var lista = [];
        var cont = 0;

        function autocomplete(inp, arr) {
            var currentFocus;
            inp.addEventListener("input", function (e) {
                if (cont > 3) {
                    var a, b, i, val = this.value;
                    if (!val) { return false; }
                    currentFocus = -1;
                    a = document.createElement("DIV");
                    a.setAttribute("id", this.id + "autocomplete-list");
                    a.setAttribute("class", "autocomplete-items");
                    this.parentNode.appendChild(a);
                    for (i = 0; i < arr.length; i++) {
                        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                            b = document.createElement("DIV");
                            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                            b.innerHTML += arr[i].substr(val.length);
                            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                            b.addEventListener("click", function (e) {
                                inp.value = this.getElementsByTagName("input")[0].value;
                                closeAllLists();
                            });
                            a.appendChild(b);
                        }
                    }
                }
            });
            inp.addEventListener("keydown", function (e) {
                cont = $('#RazaoSocial').val().length + 1;
                var x = document.getElementById(this.id + "autocomplete-list");
                if (x) x = x.getElementsByTagName("div");
                if (e.keyCode == 40) {
                    currentFocus++;
                    addActive(x);
                } else if (e.keyCode == 38) {
                    currentFocus--;
                    addActive(x);
                } else if (e.keyCode == 13) {
                    e.preventDefault();
                    if (currentFocus > -1) {
                        if (x) x[currentFocus].click();
                    }
                }
            });
            function addActive(x) {
                if (!x) return false;
                removeActive(x);
                if (currentFocus >= x.length) currentFocus = 0;
                if (currentFocus < 0) currentFocus = (x.length - 1);
                x[currentFocus].classList.add("autocomplete-active");
            }
            function removeActive(x) {
                for (var i = 0; i < x.length; i++) {
                    x[i].classList.remove("autocomplete-active");
                }
            }
            function closeAllLists(elmnt) {

                var x = document.getElementsByClassName("autocomplete-items");
                for (var i = 0; i < x.length; i++) {
                    if (elmnt != x[i] && elmnt != inp) {
                        x[i].parentNode.removeChild(x[i]);
                    }
                }

            }
            document.addEventListener("click", function (e) {
                closeAllLists(e.target);
            });
        }

        function executar() {
            var urlAtual = $(location).attr("href");
            $.ajax({
                url: urlAtual+'/BuscarOutorgas',
                //url: '@Url.Action("BuscarOutorgas","Concessionaria")',
                async: false,
                dataType: 'json',
                cache: false,
                success: function (result) {
                    lista = result.Objeto;
                }
            });
        }
        executar();

        autocomplete(document.getElementById("RazaoSocial"), lista);
    },
    AutocompleteResponsavelTecnico: function () {
        var lista = [];
        var cont = 0;

        function autocomplete(inp, arr) {
            var currentFocus;
            inp.addEventListener("input", function (e) {
                if (cont > 3) {
                    var a, b, i, val = this.value;
                    closeAllLists();
                    if (!val) { return false; }
                    currentFocus = -1;
                    a = document.createElement("DIV");
                    a.setAttribute("id", this.id + "autocomplete-list");
                    a.setAttribute("class", "autocomplete-items");
                    this.parentNode.appendChild(a);
                    for (i = 0; i < arr.length; i++) {
                        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                            b = document.createElement("DIV");
                            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                            b.innerHTML += arr[i].substr(val.length);
                            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                            b.addEventListener("click", function (e) {
                                inp.value = this.getElementsByTagName("input")[0].value;
                                closeAllLists();
                            });
                            a.appendChild(b);
                        }
                    }
                }
            });
            inp.addEventListener("keydown", function (e) {
                cont = $('#ResponsavelTecnico').val().length + 1;
                var x = document.getElementById(this.id + "autocomplete-list");
                if (x) x = x.getElementsByTagName("div");
                if (e.keyCode == 40) {
                    currentFocus++;
                    addActive(x);
                } else if (e.keyCode == 38) {
                    currentFocus--;
                    addActive(x);
                } else if (e.keyCode == 13) {
                    e.preventDefault();
                    if (currentFocus > -1) {
                        if (x) x[currentFocus].click();
                    }
                }
            });
            function addActive(x) {
                if (!x) return false;
                removeActive(x);
                if (currentFocus >= x.length) currentFocus = 0;
                if (currentFocus < 0) currentFocus = (x.length - 1);
                x[currentFocus].classList.add("autocomplete-active");
            }
            function removeActive(x) {
                for (var i = 0; i < x.length; i++) {
                    x[i].classList.remove("autocomplete-active");
                }
            }
            function closeAllLists(elmnt) {
                var x = document.getElementsByClassName("autocomplete-items");
                for (var i = 0; i < x.length; i++) {
                    if (elmnt != x[i] && elmnt != inp) {
                        x[i].parentNode.removeChild(x[i]);
                    }
                }
            }
            document.addEventListener("click", function (e) {
                closeAllLists(e.target);
            });
        }

        function executar() {
            var urlAtual = $(location).attr("href");
            $.ajax({
                url: urlAtual+'/BuscarResponsaveisTecnicos',
                async: false,
                dataType: 'json',
                cache: false,
                success: function (result) {
                    lista = result.Objeto
                }
            });
        }
        executar();
        autocomplete(document.getElementById("ResponsavelTecnico"), lista);
    }
};