using Microsoft.EntityFrameworkCore;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.Data.DbContexts
{
    public class MessagesDbContext : DbContext
    {
        public DbSet<Message> Messages { get; set; }

        public MessagesDbContext(DbContextOptions options) : base(options)
        {
            
        }
    }
}
