var vm = new Vue({
    el: '#containerTelefone',
    data: {
        telefones: [{}],
        tiposTelefone: [
            { text: 'Residencial', value: '1' },
            { text: 'Comercial', value: '2' },
            { text: 'Celular', value: '3' }
        ]
    },
    created: function () {
        var id = $('#CodigoResponsavelTecnico').val();

        if (id != null) {
            $.getJSON($.UrlRootPath+'/Concessionaria/GetTelefonesResponsavelTecnico', { id: id })
                .then(function (telefones) {
                    var telefonesEmFormatoObjecto = telefones.map(function (telefone) {
                        return {
                            numero: telefone.Telefone,
                            tipo: telefone.Tipo,
                            codigo: telefone.Codigo
                        }
                    });
                    vm.telefones = telefonesEmFormatoObjecto;
                });
        }
    },
    methods: {
        adicionarTelefone: function () {
            this.telefones.push({});
        },
        removerTelefone: function (index) {
            this.$delete(this.telefones, index);
        }
    }
});