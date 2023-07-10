Vue.config.devtools = true;
var vmEmails = new Vue({
    el: '#containerEmail',
    data: {
        emails: [{}]
    },
    created: function () {
        var id = $('#CodigoResponsavelTecnico').val();
        if (id != null) {
            $.getJSON($.UrlRootPath+'/Concessionaria/GetEmailsResponsavelTecnico', {id: id})
                .then(function (emails) {
                    var emailsEmFormatoObjecto = emails.map(function (email) {
                        return {
                            endereco: email.Email,
                            codigo: email.Codigo
                        }
                    });
                    vmEmails.emails = emailsEmFormatoObjecto;
                });
        }
    },
    methods: {
        adicionarEmail: function () {
            this.emails.push({});
        },
        removerEmail: function (index) {
            this.$delete(this.emails, index);
        }
    }
});