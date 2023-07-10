using Microsoft.AspNetCore.Mvc;
using ClosedXML.Excel;
using System;
using System.IO;
using System.Linq;
using API_Baixa_Sapiens.ContextoDB;
using Microsoft.EntityFrameworkCore;

namespace API_Baixa_Sapiens.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExcelController : ControllerBase
    {
        [HttpPost("ConvertToSql")]
        public IActionResult ConvertToSql()
        {
            try
            {
                var file = Request.Form.Files[0];

                if (file.Length == 0)
                {
                    return BadRequest("Nenhum arquivo enviado");
                }

                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = Guid.NewGuid().ToString() + fileExtension;
                var filePath = Path.Combine(Path.GetTempPath(), fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                var arquivoScriptPath = ConvertExcelToSql(filePath);

                if (string.IsNullOrEmpty(arquivoScriptPath))
                {
                    return StatusCode(500, "Ocorreu um erro ao converter o arquivo");
                }

                // Retorna um objeto JSON com o campo convertedFilePath
                return Ok(new { convertedFilePath = arquivoScriptPath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ocorreu um erro ao processar o arquivo: {ex.Message}");
            }
        }

        [HttpGet("DownloadFile")]
        public IActionResult DownloadFile(string filePath)
        {
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "application/octet-stream", Path.GetFileName(filePath));
        }

        private string ConvertExcelToSql(string filePath)
        {
            try
            {
                var workbook = new XLWorkbook(filePath);
                var worksheet = workbook.Worksheet("Planilha1");

                var totalLinhas = worksheet.Rows().Count();
                var arquivoScriptPath = Path.Combine(Path.GetDirectoryName(filePath), "Solicitação-(ARRECAD-1585)Teste.sql");

                using (var arquivoScript = new StreamWriter(arquivoScriptPath))
                {
                    arquivoScript.WriteLine("USE BD_COBRANCA\r\nGO\r\n\r\nSET DATEFORMAT YMD\r\n\r\nDECLARE @qtdAutos\t\t\t\t\tINT,\r\n\t\t@NR_AUTO_INFRACAO\t\t\tVARCHAR(20),\r\n\t\t@CO_CHAVE_ORIGEM\t\t\tVARCHAR(20),\r\n\t\t@DT_PAGAMENTO\t\t\t\tDATETIME,\r\n\t\t@VL_PAGAMENTO\t\t\t\tNUMERIC(13,2),\r\n\t\t@SQ_DOCUMENTO\t\t\t\tINT,\r\n\t\t@NR_ORDEM_DOC_ENVIO\t\t\tINT,\r\n\t\t@IDSITUACAOANTERIOR_MULTAS\tINT \r\n\r\nIF OBJECT_ID('TEMPDB.DBO.#TBL_TEMP_AUTOS_BAIXA_MANUAL') IS NOT NULL \r\n\tDROP TABLE #TBL_TEMP_AUTOS_BAIXA_MANUAL\r\n\r\nCREATE TABLE #TBL_TEMP_AUTOS_BAIXA_MANUAL(Id INT IDENTITY(1, 1), CPF_CNPJ VARCHAR(20), NR_AUTO_INFRACAO VARCHAR(20), CO_CHAVE_DOCUMENTO_ORIGEM VARCHAR(20), DT_PAGAMENTO DATETIME, VL_PAGAMENTO NUMERIC(13,2)) \r\n\r\n");
                    int comentarioLinha = 0;
                    string ultimaLinhaCol_A = "";

                    for (int l = 2; l <= totalLinhas; l++)
                    {
                        ultimaLinhaCol_A = worksheet.Cell(l, "A").Value.ToString();

                        if (!string.IsNullOrEmpty(ultimaLinhaCol_A))
                        {
                            comentarioLinha++;
                            string cpfCnpj = worksheet.Cell(l, "C").Value.ToString().Trim().Replace("/", "").Replace("-", "");
                            string colunaE = worksheet.Cell(l, "E").Value.ToString().Trim() == "" ? "NULL" : worksheet.Cell(l, "E").Value.ToString().Trim();
                            string colunaData = Convert.ToDateTime(worksheet.Cell(l, "I").Value).ToString("yyyy/MM/dd HH:mm:ss");
                            string strSqlInsert = $"/* Linha {comentarioLinha} */" + $@"INSERT INTO #TBL_TEMP_AUTOS_BAIXA_MANUAL VALUES('{cpfCnpj}','{worksheet.Cell(l, "D").Value.ToString().Trim()}','{colunaE}' ,'{colunaData}' , CAST(REPLACE(REPLACE('{worksheet.Cell(l, "J").Value.ToString().Trim()}',' ', ''),',','.') AS NUMERIC(13,2)))" + "\n";
                            arquivoScript.WriteLine(strSqlInsert);
                        }
                    }
                    arquivoScript.WriteLine("\r\nSELECT DISTINCT\r\n\tCASE \r\n\t\tWHEN TD.CO_CHAVE_DOCUMENTO_ORIGEM IS NOT NULL THEN\r\n\t\t\t'AUTO BAIXADO NO ARRECADAÇÃO'\r\n\t\t\t\r\n\t\tELSE\r\n\t\t\t'NÃO FOI POSSIVEL BAIXAR NO ARRECADAÇÃO'\r\n\tEND AS 'EXISTE_ARRECADAÇÃO',\t\r\n\tTABM.ID,\r\n\tTABM.CPF_CNPJ,\r\n\tCASE \r\n\t\tWHEN TD.NR_CNPJ_AUTUADO IS NULL THEN\r\n\t\t\tTD.nr_cpf_autuado\r\n\t\tELSE\r\n\t\t\tTD.NR_CNPJ_AUTUADO\r\n\tEND AS 'CPFCNPJ_ARRECADAÇÃO'\t,\r\n\tTABM.NR_AUTO_INFRACAO,\r\n\tTD.CO_CHAVE_DOCUMENTO_ORIGEM,\r\n\tTABM.DT_PAGAMENTO,\r\n\tTABM.VL_PAGAMENTO\t\r\nFROM \r\n\t\t\t\t#TBL_TEMP_AUTOS_BAIXA_MANUAL\tTABM\r\n\tLEFT JOIN\tBD_COBRANCA.DBO.TBL_DOCUMENTO\tTD\t\tWITH(NOLOCK) ON (\t(TD.CO_CHAVE_DOCUMENTO_ORIGEM COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS  = TABM.CO_CHAVE_DOCUMENTO_ORIGEM COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS \r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tOR TD.NR_AUTO_INFRACAO COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS = TABM.NR_AUTO_INFRACAO COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tOR TD.CO_CHAVE_DOCUMENTO_ORIGEM COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS = TABM.NR_AUTO_INFRACAO COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS)  \r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tAND (TD.NR_CNPJ_AUTUADO COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS  = TABM.CPF_CNPJ COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS  \r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tOR TD.NR_CPF_AUTUADO COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS  = TABM.CPF_CNPJ COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS ))\r\n\r\nORDER BY 2\r\n\r\n-- Adiciona a lógica aos \"Encontrado no arrecadação\"\r\nIF EXISTS (SELECT * FROM #TBL_TEMP_AUTOS_BAIXA_MANUAL)\r\n\tBEGIN\r\n\t\tSELECT @qtdAutos = COUNT(*) FROM #TBL_TEMP_AUTOS_BAIXA_MANUAL \r\n\r\n\t\tPRINT 'ALTERAÇÃO DE ' + CAST(@qtdAutos AS VARCHAR(4))\r\n\r\n\r\nWHILE (@qtdAutos > 0)\r\n\tBEGIN\r\n\t\t\r\n\t\tSET @NR_AUTO_INFRACAO\t\t= NULL\t\t\r\n\t\tSET @CO_CHAVE_ORIGEM\t\t= NULL\t\t\r\n\t\tSET @DT_PAGAMENTO\t\t\t= NULL\r\n\t\tSET @VL_PAGAMENTO\t\t\t= NULL\r\n\t\tSET @SQ_DOCUMENTO\t\t\t= NULL\r\n\t\tSET @NR_ORDEM_DOC_ENVIO\t\t= NULL\r\n\r\n\t\tSELECT \r\n\t\t\t@NR_AUTO_INFRACAO\t= TABM.NR_AUTO_INFRACAO, \r\n\t\t\t@CO_CHAVE_ORIGEM\t= TD.CO_CHAVE_DOCUMENTO_ORIGEM, \r\n\t\t\t@DT_PAGAMENTO\t\t= DT_PAGAMENTO, \r\n\t\t\t@VL_PAGAMENTO\t\t= VL_PAGAMENTO \r\n\t\tFROM \r\n\t\t\t\t\t\t#TBL_TEMP_AUTOS_BAIXA_MANUAL\tTABM\r\n\t\t\tINNER JOIN\tBD_COBRANCA.DBO.TBL_DOCUMENTO\tTD\t\tWITH(NOLOCK) ON (\t(TD.CO_CHAVE_DOCUMENTO_ORIGEM COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS  = TABM.CO_CHAVE_DOCUMENTO_ORIGEM COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS \r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tOR TD.NR_AUTO_INFRACAO COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS = TABM.NR_AUTO_INFRACAO COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tOR TD.CO_CHAVE_DOCUMENTO_ORIGEM COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS = TABM.NR_AUTO_INFRACAO COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS)   \r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tAND (TD.NR_CNPJ_AUTUADO COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS  = TABM.CPF_CNPJ COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS  \r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tOR TD.NR_CPF_AUTUADO COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS  = TABM.CPF_CNPJ COLLATE SQL_LATIN1_GENERAL_CP1_CI_AS ))\r\n\t\tWHERE \r\n\t\t\tID = @QTDAUTOS \r\n\r\n\t\tSELECT \r\n\t\t\t@SQ_DOCUMENTO\t\t= TD.SQ_DOCUMENTO,\r\n\t\t\t@NR_ORDEM_DOC_ENVIO = (SELECT MAX(NR_ORDEM_DOCUMENTO_ENVIO) FROM BD_COBRANCA.DBO.TBL_DOCUMENTO_ENVIO WITH(NOLOCK) WHERE SQ_DOCUMENTO = TD.SQ_DOCUMENTO)\r\n\t\tFROM\t\r\n\t\t\tBD_COBRANCA.DBO.TBL_DOCUMENTO\t\tTD\tWITH(NOLOCK) \r\n\t\tWHERE \r\n\t\t\t\tCO_CHAVE_DOCUMENTO_ORIGEM = @CO_CHAVE_ORIGEM \r\n\t\t\tAND SQ_FASE_DOCUMENTO = (\tSELECT MAX(SQ_FASE_DOCUMENTO) \r\n\t\t\t\t\t\t\t\t\t\tFROM BD_COBRANCA.DBO.TBL_DOCUMENTO WITH(NOLOCK) \r\n\t\t\t\t\t\t\t\t\t\tWHERE \r\n\t\t\t\t\t\t\t\t\t\t\t\tCO_CHAVE_DOCUMENTO_ORIGEM = @CO_CHAVE_ORIGEM \r\n\t\t\t\t\t\t\t\t\t\t\tAND SQ_FASE_DOCUMENTO <> 12\r\n\t\t\t\t\t\t\t\t\t)\r\n\r\n\t\tIF\t\t(@NR_AUTO_INFRACAO = '1833338' AND @CO_CHAVE_ORIGEM <> '1348606')\r\n\t\t\tOR  (@NR_AUTO_INFRACAO = '2438153' AND @CO_CHAVE_ORIGEM <> '1501827')\r\n\t\t\tBEGIN\r\n\t\t\t\tSET @NR_AUTO_INFRACAO\t\t= NULL\t\t\r\n\t\t\t\tSET @CO_CHAVE_ORIGEM\t\t= NULL\t\t\r\n\t\t\t\tSET @DT_PAGAMENTO\t\t\t= NULL\r\n\t\t\t\tSET @VL_PAGAMENTO\t\t\t= NULL\r\n\t\t\t\tSET @SQ_DOCUMENTO\t\t\t= NULL\r\n\t\t\t\tSET @NR_ORDEM_DOC_ENVIO\t\t= NULL\r\n\t\t\tEND\r\n\r\n\r\n\t\tPRINT 'EXECUÇÃO DE BAIXA MANUAL PARA O AI: ' + @NR_AUTO_INFRACAO + ' - CO_CHAVE_DOCUMENTO_ORIGEM: ' + @CO_CHAVE_ORIGEM + ' - DT_PAGAMENTO: ' + CAST(@DT_PAGAMENTO AS VARCHAR(20)) + ' - VL_PAGAMENTO: ' + CAST(@VL_PAGAMENTO AS VARCHAR(20))\r\n\r\n\t\tIF NOT EXISTS (SELECT 1\r\n\t\t\t\t\t\tFROM\t\r\n\t\t\t\t\t\t\tBD_COBRANCA.DBO.TBL_FINANCEIRA\tTF WITH(NOLOCK) \r\n\t\t\t\t\t\tWHERE\r\n\t\t\t\t\t\t\t\tSQ_DOCUMENTO = @SQ_DOCUMENTO\r\n\t\t\t\t\t\t\tAND NR_ORDEM_DOCUMENTO_ENVIO = @NR_ORDEM_DOC_ENVIO\r\n\t\t\t\t\t\t\tAND DA_PAGAMENTO IS NOT NULL\r\n\t\t\t\t\t\t\tAND ID_TP_QUITACAO IN (26, 25)\r\n\t\t\t\t\t\t)\r\n\t\t\tBEGIN\t\t\t\t\t\t\t\t\t\r\n\t\t\t\tIF NOT EXISTS (\tSELECT 1\r\n\t\t\t\t\t\t\t\tFROM\t\r\n\t\t\t\t\t\t\t\t\tBD_COBRANCA.DBO.TBL_FINANCEIRA\tTF WITH(NOLOCK) \r\n\t\t\t\t\t\t\t\tWHERE\r\n\t\t\t\t\t\t\t\t\t\tSQ_DOCUMENTO = @SQ_DOCUMENTO\r\n\t\t\t\t\t\t\t\t\tAND NR_ORDEM_DOCUMENTO_ENVIO = @NR_ORDEM_DOC_ENVIO\r\n\t\t\t\t\t\t\t\t\tAND DA_PAGAMENTO IS NOT NULL\r\n\t\t\t\t\t\t\t\t)\r\n\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\tPRINT ' SEM PAGAMENTO PRÉVIO '\r\n\r\n\t\t\t\t\t\t\tBEGIN TRANSACTION\r\n\t\t\t\t\t\r\n\t\t\t\t\t\t\tUPDATE BD_COBRANCA.DBO.TBL_FINANCEIRA\r\n\t\t\t\t\t\t\tSET DA_PAGAMENTO\t\t= @DT_PAGAMENTO,\r\n\t\t\t\t\t\t\t\tVL_PAGAMENTO\t\t= @VL_PAGAMENTO,\r\n\t\t\t\t\t\t\t\tIN_BAIXA_AUTOMATICA = 0,\r\n\t\t\t\t\t\t\t\tDS_OBSERVACAO\t\t= 'AI BAIXADO ATRAVÉS DE ROTINA EM BANCO DE DADOS CONFORME SOLICITADO ATRAVÉS DOS SICAD 37.843.',\r\n\t\t\t\t\t\t\t\tID_TP_QUITACAO\t\t= 26\r\n\t\t\t\t\t\t\tWHERE \r\n\t\t\t\t\t\t\t\t\tSQ_DOCUMENTO = @SQ_DOCUMENTO\r\n\t\t\t\t\t\t\t\tAND NR_ORDEM_DOCUMENTO_ENVIO = @NR_ORDEM_DOC_ENVIO\r\n\t\t\t\t\t\r\n\t\t\t\t\t\t\tIF @@ERROR <> 0\r\n\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\tPRINT 'ERRO AO TENTAR FAZER UPDATE NA TABELA FINANCEIRA DO COBRANCA!!'\r\n\t\t\t\t\t\t\t\t\tROLLBACK\r\n\t\t\t\t\t\t\t\tEND\r\n\t\t\t\t\t\t\tELSE\r\n\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\tPRINT 'EXECUTOU O UPDATE NA TABELA FINANCEIRA DO COBRANCA.'\r\n\t\t\t\t\t\t\t\t\tCOMMIT\r\n\t\t\t\t\t\t\t\tEND \r\n\r\n\t\t\t\t\t\t\tBEGIN TRANSACTION\r\n\r\n\t\t\t\t\t\t\t\tUPDATE BD_COBRANCA.DBO.TBL_DOCUMENTO_ENVIO\r\n\t\t\t\t\t\t\t\tSET ST_DOCUMENTO = 'P'\r\n\t\t\t\t\t\t\t\tWHERE \r\n\t\t\t\t\t\t\t\t\t\tSQ_DOCUMENTO = @SQ_DOCUMENTO\r\n\t\t\t\t\t\t\t\t\tAND NR_ORDEM_DOCUMENTO_ENVIO = @NR_ORDEM_DOC_ENVIO\r\n\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\tIF @@ERROR <> 0\r\n\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\tPRINT 'ERRO AO TENTAR FAZER UPDATE NA TABELA DOCUMENTO ENVIO DO COBRANCA!!'\r\n\t\t\t\t\t\t\t\t\tROLLBACK\r\n\t\t\t\t\t\t\t\tEND\r\n\t\t\t\t\t\t\tELSE\r\n\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\tPRINT 'EXECUTOU O UPDATE NA TABELA DOCUMENTO ENVIO DO COBRANCA.'\r\n\t\t\t\t\t\t\t\t\tCOMMIT\r\n\t\t\t\t\t\t\t\tEND \r\n\r\n\t\t\t\t\t\tIF EXISTS (SELECT 1 FROM BD_MULTAS.DBO.TBLDOCUMENTO WITH(NOLOCK) WHERE CAST(IDDOCUMENTO AS VARCHAR(20)) = @CO_CHAVE_ORIGEM)\r\n\t\t\t\t\t\t\tBEGIN\r\n\r\n\t\t\t\t\t\t\t\tPRINT 'É UM AI DO SISMULTAS'\r\n\r\n\t\t\t\t\t\t\t\tIF EXISTS (SELECT 1 FROM BD_MULTAS.DBO.TBLDOCUMENTO WITH(NOLOCK) WHERE CAST(IDDOCUMENTO AS VARCHAR(20)) = @CO_CHAVE_ORIGEM AND IDSITUACAO <> 14)\r\n\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\tBEGIN TRANSACTION\r\n\r\n\t\t\t\t\t\t\t\t\t\t\tUPDATE BD_MULTAS.DBO.TBLDOCUMENTO\r\n\t\t\t\t\t\t\t\t\t\t\tSET IDSITUACAO = 14 \r\n\t\t\t\t\t\t\t\t\t\t\tWHERE \r\n\t\t\t\t\t\t\t\t\t\t\t\tCAST(IDDOCUMENTO AS VARCHAR(20)) = @CO_CHAVE_ORIGEM\r\n\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\tIF @@ERROR <> 0\r\n\t\t\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\t\t\t\tPRINT 'ERRO AO TENTAR FAZER UPDATE DE QUITAÇÃO NA TABELA DOCUMENTO DO MULTAS!!'\r\n\t\t\t\t\t\t\t\t\t\t\t\tROLLBACK\r\n\t\t\t\t\t\t\t\t\t\t\tEND\r\n\t\t\t\t\t\t\t\t\t\tELSE\r\n\t\t\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\t\t\t\tPRINT 'EXECUTOU O UPDATE DE QUITAÇÃO NA TABELA DOCUMENTO DO MULTAS.'\r\n\t\t\t\t\t\t\t\t\t\t\t\tCOMMIT\r\n\t\t\t\t\t\t\t\t\t\t\tEND \r\n\t\r\n\r\n\t\t\t\t\t\t\t\t\t\tSELECT \r\n\t\t\t\t\t\t\t\t\t\t\t@IDSITUACAOANTERIOR_MULTAS =  IDSITUACAOATUAL \r\n\t\t\t\t\t\t\t\t\t\tFROM \r\n\t\t\t\t\t\t\t\t\t\t\tBD_MULTAS.DBO.TBLDOCUMENTOSITUACAOAUDITORIA \r\n\t\t\t\t\t\t\t\t\t\tWHERE \r\n\t\t\t\t\t\t\t\t\t\t\t\tCAST(IDDOCUMENTO AS VARCHAR(20)) =  @CO_CHAVE_ORIGEM \r\n\t\t\t\t\t\t\t\t\t\t\tAND IDDOCUMENTOSITUACAOAUDITORIA = (SELECT MAX(IDDOCUMENTOSITUACAOAUDITORIA) FROM BD_MULTAS.DBO.TBLDOCUMENTOSITUACAOAUDITORIA WITH(NOLOCK) WHERE CAST(IDDOCUMENTO AS VARCHAR(20)) =  @CO_CHAVE_ORIGEM)\r\n\r\n\t\t\t\t\t\t\t\t\t\tBEGIN TRANSACTION\r\n\r\n\t\t\t\t\t\t\t\t\t\t\tINSERT INTO BD_MULTAS.DBO.TBLDOCUMENTOSITUACAOAUDITORIA\r\n\t\t\t\t\t\t\t\t\t\t\tVALUES(GETDATE(), @CO_CHAVE_ORIGEM, 7707, @IDSITUACAOANTERIOR_MULTAS, 14, NULL) \r\n\r\n\t\t\t\t\t\t\t\t\t\t\t\t\r\n\r\n\t\t\t\t\t\t\t\t\t\tIF @@ERROR <> 0\r\n\t\t\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\t\t\t\tPRINT 'ERRO AO TENTAR FAZER INSERT NA TABELA TBLDOCUMENTOSITUACAOAUDITORIA DO MULTAS!!'\r\n\t\t\t\t\t\t\t\t\t\t\t\tROLLBACK\r\n\t\t\t\t\t\t\t\t\t\t\tEND\r\n\t\t\t\t\t\t\t\t\t\tELSE\r\n\t\t\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\t\t\t\tPRINT 'EXECUTOU O INSERT NA TABELA TBLDOCUMENTOSITUACAOAUDITORIA DO MULTAS.'\r\n\t\t\t\t\t\t\t\t\t\t\t\tCOMMIT\r\n\t\t\t\t\t\t\t\t\t\t\tEND \r\n\r\n\t\t\t\t\t\t\t\t\tEND\r\n\t\t\t\t\r\n\t\t\t\t\t\t\t\tIF EXISTS (SELECT 1 FROM BD_MULTAS.DBO.TBLDOCUMENTOSITUACAO WITH(NOLOCK) WHERE CAST(IDDOCUMENTO AS VARCHAR(20)) = @CO_CHAVE_ORIGEM AND PAGAMENTO IS NULL)\r\n\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\t\tBEGIN TRANSACTION\r\n\r\n\t\t\t\t\t\t\t\t\t\t\tUPDATE BD_MULTAS.DBO.TBLDOCUMENTOSITUACAO\r\n\t\t\t\t\t\t\t\t\t\t\tSET PAGAMENTO = @DT_PAGAMENTO\r\n\t\t\t\t\t\t\t\t\t\t\tWHERE \r\n\t\t\t\t\t\t\t\t\t\t\t\tCAST(IDDOCUMENTO AS VARCHAR(20)) = @CO_CHAVE_ORIGEM\r\n\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\tIF @@ERROR <> 0\r\n\t\t\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\t\t\t\tPRINT 'ERRO AO TENTAR FAZER O UPDATE DA DATA DE PAGAMENTO DA TABELA TBLDOCUMENTOSITUACAO DO MULTAS!!'\r\n\t\t\t\t\t\t\t\t\t\t\t\tROLLBACK\r\n\t\t\t\t\t\t\t\t\t\t\tEND\r\n\t\t\t\t\t\t\t\t\t\tELSE\r\n\t\t\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\t\t\t\tPRINT 'EXECUTOU O UPDATE DA DATA DE PAGAMENTO DA TABELA TBLDOCUMENTOSITUACAO DO MULTAS.'\r\n\t\t\t\t\t\t\t\t\t\t\t\tCOMMIT\r\n\t\t\t\t\t\t\t\t\t\t\tEND \r\n\t\t\t\t\t\t\t\t\tEND\r\n\t\t\t\t\t\t\tEND\r\n\t\t\t\t\t\tELSE\r\n\t\t\t\t\t\t\tPRINT 'NÃO É UM AI DO SISMULTAS'\r\n\r\n\t\t\t\t\tEND \t\t\t\r\n\t\t\t\tELSE \r\n\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\tPRINT ' HOUVE UM PAGAMENTO PRÉVIO '\r\n\t\t\t\t\r\n\t\t\t\t\t\tBEGIN TRANSACTION\r\n\r\n\t\t\t\t\t\t\tINSERT INTO BD_COBRANCA.DBO.TBL_FINANCEIRA\r\n\t\t\t\t\t\t\tSELECT \r\n\t\t\t\t\t\t\t\tDA_DOCUMENTO,\r\n\t\t\t\t\t\t\t\tNULL,\r\n\t\t\t\t\t\t\t\tDA_VENCIMENTO,\r\n\t\t\t\t\t\t\t\tNULL,\r\n\t\t\t\t\t\t\t\t(NR_ORDEM_FINANCEIRA + 1),\r\n\t\t\t\t\t\t\t\tVL_DOCUMENTO,\r\n\t\t\t\t\t\t\t\tVL_DESCONTO,\r\n\t\t\t\t\t\t\t\tVL_MORA_MULTA,\r\n\t\t\t\t\t\t\t\t@DT_PAGAMENTO,\r\n\t\t\t\t\t\t\t\t@VL_PAGAMENTO,\r\n\t\t\t\t\t\t\t\tCO_TIPO_CODIGO_BARRA,\r\n\t\t\t\t\t\t\t\tNULL,\r\n\t\t\t\t\t\t\t\tDA_LIMITE_PAGAMENTO,\r\n\t\t\t\t\t\t\t\tVL_LIMITE_PAGAMENTO,\r\n\t\t\t\t\t\t\t\tSQ_TIPO_ARRECADACAO,\r\n\t\t\t\t\t\t\t\tSQ_DOCUMENTO,\r\n\t\t\t\t\t\t\t\tNR_ORDEM_DOCUMENTO_ENVIO,\r\n\t\t\t\t\t\t\t\tNULL,\r\n\t\t\t\t\t\t\t\tNULL,\r\n\t\t\t\t\t\t\t\t'AI BAIXADO ATRAVÉS DE ROTINA EM BANCO DE DADOS CONFORME SOLICITADO ATRAVÉS DOS SICAD 37.843.',\r\n\t\t\t\t\t\t\t\t0,\r\n\t\t\t\t\t\t\t\tVL_DOCUMENTO_DOLAR,\r\n\t\t\t\t\t\t\t\tVL_INDICE_PTAX,\r\n\t\t\t\t\t\t\t\tDA_INICIO_SELIC,\r\n\t\t\t\t\t\t\t\tDA_FIM_SELIC,\r\n\t\t\t\t\t\t\t\tPERCENTUAL_SELIC_MAISUMPORCENTO,\r\n\t\t\t\t\t\t\t\tVL_JUROS_SELIC_MAISUMPORCENTO,\r\n\t\t\t\t\t\t\t\tVL_PERCENTUAL_MULTA_MORA,\r\n\t\t\t\t\t\t\t\tIN_VALOR_COMPLEMENTAR,\r\n\t\t\t\t\t\t\t\t26,\r\n\t\t\t\t\t\t\t\tDA_CONVERSAO_RENDA,\r\n\t\t\t\t\t\t\t\tVL_CONVERSAO_RENDA,\r\n\t\t\t\t\t\t\t\tVL_RESIDUAL,\r\n\t\t\t\t\t\t\t\tSQ_STATUS_FINANCEIRO,\r\n\t\t\t\t\t\t\t\tVL_HIST_DOCUMENTO,\r\n\t\t\t\t\t\t\t\tVL_HIST_PAGAMENTO,\r\n\t\t\t\t\t\t\t\tDA_VENCIMENTO_PARCELAMENTO\r\n\t\t\t\t\t\t\tFROM \r\n\t\t\t\t\t\t\t\tBD_COBRANCA.DBO.TBL_FINANCEIRA WITH(NOLOCK) \r\n\t\t\t\t\t\t\tWHERE \r\n\t\t\t\t\t\t\t\t\tSQ_DOCUMENTO = @SQ_DOCUMENTO\r\n\t\t\t\t\t\t\t\tAND NR_ORDEM_DOCUMENTO_ENVIO = @NR_ORDEM_DOC_ENVIO\r\n\t\t\t\t\t\t\t\tAND NR_ORDEM_FINANCEIRA = (SELECT MAX(NR_ORDEM_FINANCEIRA) FROM BD_COBRANCA.DBO.TBL_FINANCEIRA WITH(NOLOCK) WHERE SQ_DOCUMENTO = @SQ_DOCUMENTO AND NR_ORDEM_DOCUMENTO_ENVIO = @NR_ORDEM_DOC_ENVIO)\r\n\t\t\t\t\r\n\t\t\t\t\t\tIF @@ERROR <> 0\r\n\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\tPRINT 'ERRO AO TENTAR FAZER UPDATE NA TABELA FINANCEIRA DO COBRANCA!!'\r\n\t\t\t\t\t\t\t\tROLLBACK\r\n\t\t\t\t\t\t\tEND\r\n\t\t\t\t\t\tELSE\r\n\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\tPRINT 'EXECUTOU O UPDATE NA TABELA FINANCEIRA DO COBRANCA.'\r\n\t\t\t\t\t\t\t\tCOMMIT\r\n\t\t\t\t\t\t\tEND \r\n\r\n\t\t\t\t\t\tBEGIN TRANSACTION\r\n\r\n\t\t\t\t\t\t\tUPDATE BD_COBRANCA.DBO.TBL_DOCUMENTO_ENVIO\r\n\t\t\t\t\t\t\tSET ST_DOCUMENTO = 'P'\r\n\t\t\t\t\t\t\tWHERE \r\n\t\t\t\t\t\t\t\t\tSQ_DOCUMENTO = @SQ_DOCUMENTO\r\n\t\t\t\t\t\t\t\tAND NR_ORDEM_DOCUMENTO_ENVIO = @NR_ORDEM_DOC_ENVIO\r\n\t\t\t\t\r\n\t\t\t\t\t\tIF @@ERROR <> 0\r\n\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\tPRINT 'ERRO AO TENTAR FAZER UPDATE NA TABELA DOCUMENTO ENVIO DO COBRANCA!!'\r\n\t\t\t\t\t\t\t\tROLLBACK\r\n\t\t\t\t\t\t\tEND\r\n\t\t\t\t\t\tELSE\r\n\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\tPRINT 'EXECUTOU O UPDATE NA TABELA DOCUMENTO ENVIO DO COBRANCA.'\r\n\t\t\t\t\t\t\t\tCOMMIT\r\n\t\t\t\t\t\t\tEND \r\n\r\n\r\n\t\t\t\t\t\tIF EXISTS (SELECT 1 FROM BD_MULTAS.DBO.TBLDOCUMENTO WITH(NOLOCK) WHERE CAST(IDDOCUMENTO AS VARCHAR(20)) = @CO_CHAVE_ORIGEM)\r\n\t\t\t\t\t\t\tBEGIN\r\n\r\n\t\t\t\t\t\t\t\tPRINT 'É UM AI DO SISMULTAS'\r\n\r\n\t\t\t\t\t\t\t\tIF EXISTS (SELECT 1 FROM BD_MULTAS.DBO.TBLDOCUMENTO WITH(NOLOCK) WHERE CAST(IDDOCUMENTO AS VARCHAR(20)) = @CO_CHAVE_ORIGEM AND IDSITUACAO <> 14)\r\n\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\tBEGIN TRANSACTION\r\n\r\n\t\t\t\t\t\t\t\t\t\t\tUPDATE BD_MULTAS.DBO.TBLDOCUMENTO\r\n\t\t\t\t\t\t\t\t\t\t\tSET IDSITUACAO = 14 \r\n\t\t\t\t\t\t\t\t\t\t\tWHERE \r\n\t\t\t\t\t\t\t\t\t\t\t\tCAST(IDDOCUMENTO AS VARCHAR(20)) = @CO_CHAVE_ORIGEM\r\n\t\t\t\t\t\t\t\t\t\t\t\t \r\n\t\t\t\t\t\t\t\t\t\tIF @@ERROR <> 0\r\n\t\t\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\t\t\t\tPRINT 'ERRO AO TENTAR FAZER UPDATE DE QUITAÇÃO NA TABELA DOCUMENTO DO MULTAS!!'\r\n\t\t\t\t\t\t\t\t\t\t\t\tROLLBACK\r\n\t\t\t\t\t\t\t\t\t\t\tEND\r\n\t\t\t\t\t\t\t\t\t\tELSE\r\n\t\t\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\t\t\t\tPRINT 'EXECUTOU O UPDATE DE QUITAÇÃO NA TABELA DOCUMENTO DO MULTAS.'\r\n\t\t\t\t\t\t\t\t\t\t\t\tCOMMIT\r\n\t\t\t\t\t\t\t\t\t\t\tEND \r\n\t\r\n\r\n\t\t\t\t\t\t\t\t\t\tSELECT \r\n\t\t\t\t\t\t\t\t\t\t\t@IDSITUACAOANTERIOR_MULTAS =  IDSITUACAOATUAL \r\n\t\t\t\t\t\t\t\t\t\tFROM \r\n\t\t\t\t\t\t\t\t\t\t\tBD_MULTAS.DBO.TBLDOCUMENTOSITUACAOAUDITORIA \r\n\t\t\t\t\t\t\t\t\t\tWHERE \r\n\t\t\t\t\t\t\t\t\t\t\tCAST(IDDOCUMENTO AS VARCHAR(20)) =  @CO_CHAVE_ORIGEM\r\n\t\t\t\t\t\t\t\t\t\tAND IDDOCUMENTOSITUACAOAUDITORIA = (SELECT MAX(IDDOCUMENTOSITUACAOAUDITORIA) FROM BD_MULTAS.DBO.TBLDOCUMENTOSITUACAOAUDITORIA WITH(NOLOCK) WHERE CAST(IDDOCUMENTO AS VARCHAR(20)) =  @CO_CHAVE_ORIGEM)\r\n\r\n\t\t\t\t\t\t\t\t\t\tBEGIN TRANSACTION\r\n\r\n\t\t\t\t\t\t\t\t\t\t\tINSERT INTO BD_MULTAS.DBO.TBLDOCUMENTOSITUACAOAUDITORIA\r\n\t\t\t\t\t\t\t\t\t\t\tVALUES(GETDATE(), @CO_CHAVE_ORIGEM, 7707, @IDSITUACAOANTERIOR_MULTAS, 14, NULL) \r\n\r\n\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\tIF @@ERROR <> 0\r\n\t\t\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\t\t\t\tPRINT 'ERRO AO TENTAR FAZER INSERT NA TABELA TBLDOCUMENTOSITUACAOAUDITORIA DO MULTAS!!'\r\n\t\t\t\t\t\t\t\t\t\t\t\tROLLBACK\r\n\t\t\t\t\t\t\t\t\t\t\tEND\r\n\t\t\t\t\t\t\t\t\t\tELSE\r\n\t\t\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\t\t\t\tPRINT 'EXECUTOU O INSERT NA TABELA TBLDOCUMENTOSITUACAOAUDITORIA DO MULTAS.'\r\n\t\t\t\t\t\t\t\t\t\t\t\tCOMMIT\r\n\t\t\t\t\t\t\t\t\t\t\tEND \r\n\r\n\t\t\t\t\t\t\t\t\tEND\r\n\t\t\t\t\r\n\t\t\t\t\t\t\t\tIF EXISTS (SELECT 1 FROM BD_MULTAS.DBO.TBLDOCUMENTOSITUACAO WITH(NOLOCK) WHERE CAST(IDDOCUMENTO AS VARCHAR(20)) = @CO_CHAVE_ORIGEM AND PAGAMENTO IS NULL)\r\n\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\t\tBEGIN TRANSACTION\r\n\r\n\t\t\t\t\t\t\t\t\t\t\tUPDATE BD_MULTAS.DBO.TBLDOCUMENTOSITUACAO\r\n\t\t\t\t\t\t\t\t\t\t\tSET PAGAMENTO = @DT_PAGAMENTO\r\n\t\t\t\t\t\t\t\t\t\t\tWHERE \r\n\t\t\t\t\t\t\t\t\t\t\t\tCAST(IDDOCUMENTO AS VARCHAR(20)) = @CO_CHAVE_ORIGEM\r\n\t\t\t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t\t\t\tIF @@ERROR <> 0\r\n\t\t\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\t\t\t\tPRINT 'ERRO AO TENTAR FAZER O UPDATE DA DATA DE PAGAMENTO DA TABELA TBLDOCUMENTOSITUACAO DO MULTAS!!'\r\n\t\t\t\t\t\t\t\t\t\t\t\tROLLBACK\r\n\t\t\t\t\t\t\t\t\t\t\tEND\r\n\t\t\t\t\t\t\t\t\t\tELSE\r\n\t\t\t\t\t\t\t\t\t\t\tBEGIN\r\n\t\t\t\t\t\t\t\t\t\t\t\tPRINT 'EXECUTOU O UPDATE DA DATA DE PAGAMENTO DA TABELA TBLDOCUMENTOSITUACAO DO MULTAS.'\r\n\t\t\t\t\t\t\t\t\t\t\t\tCOMMIT\r\n\t\t\t\t\t\t\t\t\t\t\tEND \r\n\t\t\t\t\t\t\t\t\tEND\r\n\t\t\t\t\t\t\tEND\r\n\t\t\t\t\t\tELSE\r\n\t\t\t\t\t\t\tPRINT 'NÃO É UM AI DO SISMULTAS'\r\n\t\t\t\t\tEND\r\n\t\t\tEND\r\n\t\tELSE\r\n\t\t\tBEGIN\r\n\t\t\t\tPRINT ' JÁ HOUVE BAIXA SAPIENS PARA ESTE AUTO.'\r\n\t\t\tEND\r\n\t\t\t\t\t\r\n\t\tSET @qtdAutos = @qtdAutos - 1\r\n\tEND\r\n\r\n\tPRINT 'SCRIPT FINALIZADO!' + CAST(@qtdAutos AS VARCHAR(5)) + 'REGISTROS ATUALIZADOS'\r\n\r\n\tEND");
                }

                return arquivoScriptPath;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ocorreu um erro ao converter o arquivo: {ex.Message}");
            }
        }

        [HttpPost("ExecuteScript")]
        public IActionResult ExecuteScript(string scriptFilePath, [FromServices] ContextoAPI dbContext)
        {
            try
            {
                string script = System.IO.File.ReadAllText(scriptFilePath);

                dbContext.Database.ExecuteSqlRaw(script);

                return Ok("Script executado com sucesso!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ocorreu um erro ao executar o script: " + ex.Message);
            }
        }


        private IActionResult DownloadFile(string filePath, string fileName)
        {
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "application/octet-stream", fileName);
        }
    }
}
