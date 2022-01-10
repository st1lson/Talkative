using Ganss.XSS;
using HotChocolate;
using HotChocolate.Data;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Threading.Tasks;
using TalkativeWebAPI.Data.DbContexts;
using TalkativeWebAPI.GraphQL.Messages;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.GraphQL
{
    public class Mutation
    {
        [UseDbContext(typeof(MessagesDbContext))]
        public async Task<AddMessagePayload> AddMessageAsync(AddMessageInput input, [Service] IHttpContextAccessor accessor, 
            [ScopedService] MessagesDbContext context)
        {
            HtmlSanitizer sanitizer = new();
            string userId = accessor.HttpContext!.User.Claims.First().Value;

            Message message = new()
            {
                Text = sanitizer.Sanitize(input.Text),
                UserId = userId,
                Date = DateTime.Now
            };

            await context.Messages.AddAsync(message);
            await context.SaveChangesAsync();

            return new AddMessagePayload(message);
        }
    }
}
