Vue.config.devtools = true;

var app = new Vue({
    components: {
        mask: VueTheMask
    },
    el: '#app',
    created: function () {
        this.FetchTipoDocumento();
        this.FetchMesReferencia();
    },
    data: function () {
        return {
            prazos: [],
            tiposDocumento: [],
            mesesReferencia: [],
            txtInicioVigencia: '',
            txtFimVigencia: '',
            tipoDocumento: '',
            mesReferencia: '',
            dataLimiteEnvio: '',
            count: 0
        };
    },
    methods: {
        AddPrazo: function () {
            if ($('#prazoDocumentoForm').valid() && this.ValidarDataMaiorMenor() && this.ValidarDataEnvio()) {
                this.count++;
                this.prazos.push(
                    {
                        Id: this.count,
                        Vigencia: {
                            Inicio: $("#Vigencia_Inicio").val(),
                            Final: $("#Vigencia_Final").val()
                        },
                        TipoDocumento: this.tipoDocumento.Codigo,
                        MesReferencia: this.mesReferencia.id,
                        DataLimiteEnvio: this.dataLimiteEnvio,
                        DescTipoDocumento: this.tipoDocumento.Descricao,
                        DescMesReferencia: this.mesReferencia.description
                    });
                $("#Vigencia_Inicio").val("");
                $("#Vigencia_Final").val("");
                this.tipoDocumento = '';
                this.mesReferencia = '';
                this.dataLimiteEnvio = '';
            }
        },
        ValidarDataMaiorMenor: function () {
            var dataInicio = $("#Vigencia_Inicio").val();
            var dataFim = $("#Vigencia_Final").val();
            if (dataFim != "" && dataInicio != "" && convertData(dataInicio) > convertData(dataFim)) {
                toastr.error("Data inicial maior que data final.");
                return false;
            }
            return true;
        },
        ValidarDataEnvio: function () {

            var campo = $('#DataLimiteEnvio').val();

            if (campo) {
                
                var ano = convertData($("#Vigencia_Inicio").val()).getFullYear();
                var dataEnvio = campo + "/" + ano;

                if (!mesDiaValidos(campo)) {
                    toastr.error("Data limite para envio inválida.");
                    return false;
                }

                if (convertData(dataEnvio) < convertData($('#Vigencia_Inicio').val())) {
                    toastr.error("Data de envio é menor que a data de início! Favor informar uma data válida.");
                    return false;
                }
            }
            return true;
        },

        SendPrazo: function () {
            // POST /someUrl
            axios.post($.UrlRootPath + '/RecepcaoDocumento/Cadastrar', { prazosViewModel: this.prazos })
                .then(function (response) {
                    if (response.data.Success) {

                        function explode() {
                            window.location = $.UrlRootPath + '/RecepcaoDocumento/Consultar';
                        }
                        setTimeout(explode, 3000);
                        toastr.success(response.data.Mensagem);
                    } else {
                        toastr.error(response.data.Mensagem);
                    }
                }, function (response) {
                    console.log(response);
                });
        },
        ExcluirItem: function (id) {
            this.$delete(this.prazos, id);
        },
        FetchMesReferencia: function () {
            axios.get($.UrlRootPath + '/RecepcaoDocumento/MesReferencia').then(function (response) {
                app.mesesReferencia = response.data;
            }).catch(function (error) {
                console.log(error);
            });
        },
        FetchTipoDocumento: function () {
            axios.get($.UrlRootPath + '/TipoDocumento/Listar').then(function (response) {
                app.tiposDocumento = response.data;
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
});
