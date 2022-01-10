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
        public async Task<AddMessagePayload> AddMessageAsync(AddMessageInput input,
            [Service] IHttpContextAccessor accessor,
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

        [UseDbContext(typeof(MessagesDbContext))]
        public async Task<PutMessagePayload> PutMessageAsync(PutMessageInput input,
            [Service] IHttpContextAccessor accessor,
            [ScopedService] MessagesDbContext context)
        {
            HtmlSanitizer sanitizer = new();
            PutMessageInput sanitizedInput = new(input.Id, sanitizer.Sanitize(input.Text));

            string userId = accessor.HttpContext!.User.Claims.First().Value;

            Message message = context.Messages.FirstOrDefault(m => m.Id == sanitizedInput.Id);

            if (message is null || message.UserId != userId)
            {
                throw new GraphQLException();
            }

            message.Text = sanitizedInput.Text;

            await context.SaveChangesAsync();

            return new PutMessagePayload(message);
        }

        [UseDbContext(typeof(MessagesDbContext))]
        public async Task<DeleteMessagePayload> DeleteMessagePayload(DeleteMessageInput input,
            [Service] IHttpContextAccessor accessor,
            [ScopedService] MessagesDbContext context)
        {
            string userId = accessor.HttpContext!.User.Claims.First().Value;

            Message message = context.Messages.FirstOrDefault(m => m.Id == input.Id);

            if (message is null || message.UserId != userId)
            {
                throw new GraphQLException();
            }

            context.Messages.Remove(message);

            await context.SaveChangesAsync();

            return new DeleteMessagePayload(message);
        }
    }
}
