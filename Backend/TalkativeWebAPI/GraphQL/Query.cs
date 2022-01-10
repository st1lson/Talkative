using HotChocolate;
using HotChocolate.Data;
using Microsoft.AspNetCore.Http;
using System.Linq;
using TalkativeWebAPI.Data.DbContexts;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.GraphQL
{
    public class Query
    {
        [UseDbContext(typeof(MessagesDbContext))]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Message> GetMessage([ScopedService] MessagesDbContext context)
        {
            return context.Messages;
        }

        [UseDbContext(typeof(MessagesDbContext))]
        [UseFiltering]
        [UseSorting]
        public IQueryable<ApplicationUser> GetUser([Service] IHttpContextAccessor accessor, [ScopedService] MessagesDbContext context)
        {
            string userId = accessor.HttpContext!.User.Claims.First().Value;

            return context.Users.Where(u => u.Id == userId);
        }
    }
}
