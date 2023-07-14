<script>
    $(document).ready(function () {
        $('#uploadForm').submit(function (e) {
            e.preventDefault();

            var formData = new FormData();
            formData.append('file', $('#fileInput')[0].files[0]);

            $.ajax({
                url: '/api/excel/ConvertToSql',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    var downloadLink = $('#downloadButton');
                    downloadLink.attr('href', '/api/excel/DownloadFile?filePath=' + encodeURIComponent(data.convertedFilePath));
                    downloadLink.attr('download', 'ScriptBaixaSapiens.sql');
                    $('#downloadLink').show();
                    $('#executeScriptButton').data('scriptFilePath', data.convertedFilePath).show();
                },
                error: function (xhr, status, error) {
                    alert('Ocorreu um erro ao converter o arquivo: ' + xhr.responseText);
                }
            });
        });

    $('#executeScriptButton').click(function (e) {
        e.preventDefault();

    var scriptFilePath = $(this).data('scriptFilePath');

    $.ajax({
        url: '/api/excel/ExecuteScript',
    type: 'POST',
    data: {scriptFilePath: scriptFilePath },
    success: function (result) {
        // Faça algo com o resultado retornado, se necessário
        alert('Script executado com sucesso!');
                    },
    error: function (xhr, status, error) {
        alert('Ocorreu um erro ao executar o script: ' + xhr.responseText);
                    }
                });
            });

    $('#downloadButton').click(function (e) {
        e.preventDefault();
    window.location.href = $(this).attr('href');
            });
        });
</script>