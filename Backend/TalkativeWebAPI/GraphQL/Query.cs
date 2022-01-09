using System.Linq;
using HotChocolate;
using TalkativeWebAPI.Data.DbContexts;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.GraphQL
{
    public class Query
    {
        public IQueryable<Message> GetMessage([Service] MessagesDbContext context)
        {
            return context.Messages;
        }
    }
}
