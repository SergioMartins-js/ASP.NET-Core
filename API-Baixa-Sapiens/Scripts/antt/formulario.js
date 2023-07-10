antt = antt || {};
antt.siref = antt.siref || {};
antt.siref.formulario = {
    GuardarStatus: function () {
        alert("alert");
        var self = antt.siref.formulario;
        var form = $("#form-consulta");
        var data = form.serializeArray();
        amplify.store(self.Options.FormName, data);
    }

}