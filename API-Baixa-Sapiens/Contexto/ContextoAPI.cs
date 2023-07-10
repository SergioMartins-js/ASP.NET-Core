using Microsoft.EntityFrameworkCore;


namespace API_Baixa_Sapiens.ContextoDB
{
    public class ContextoAPI : DbContext
    {
        public ContextoAPI(DbContextOptions<ContextoAPI> options) : base(options)
        {
        }

    }
}