using Microsoft.EntityFrameworkCore;


namespace API_Baixa_Sapiens.ContextoDB
{
    public class ContexoAPI : DbContext
    {
        public ContexoAPI(DbContextOptions<ContexoAPI> options) : base(options)
        {
        }

    }
}