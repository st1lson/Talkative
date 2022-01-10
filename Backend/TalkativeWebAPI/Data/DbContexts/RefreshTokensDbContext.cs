using Microsoft.EntityFrameworkCore;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.Data.DbContexts
{
    public class RefreshTokensDbContext : DbContext
    {
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        public RefreshTokensDbContext(DbContextOptions options) : base(options)
        {

        }
    }
}