using HotChocolate;
using HotChocolate.Data;
using System.Linq;
using TalkativeWebAPI.Data.DbContexts;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.GraphQL
{
    public class Query
    {
        [UseDbContext(typeof(MessagesDbContext))]
        public IQueryable<Message> GetMessage([ScopedService] MessagesDbContext context)
        {
            return context.Messages;
        }
    }
}
