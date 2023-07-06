using Microsoft.AspNetCore.Mvc;
using ClosedXML.Excel;
using System;
using System.IO;
using System.Linq;

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
                }

                return arquivoScriptPath;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ocorreu um erro ao converter o arquivo: {ex.Message}");
            }
        }

        private IActionResult DownloadFile(string filePath, string fileName)
        {
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "application/octet-stream", fileName);
        }
    }
}
