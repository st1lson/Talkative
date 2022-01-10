using Ganss.XSS;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Subscriptions;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Threading;
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
            [ScopedService] MessagesDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            HtmlSanitizer sanitizer = new();
            string userId = accessor.HttpContext!.User.Claims.First().Value;

            Message message = new()
            {
                Text = sanitizer.Sanitize(input.Text),
                UserId = userId,
                Date = DateTime.Now
            };

            context.Messages.Add(message);
            await context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            await eventSender.SendAsync(nameof(Subscription.OnMessagesChange), message, cancellationToken);

            return new AddMessagePayload(message);
        }

        [UseDbContext(typeof(MessagesDbContext))]
        public async Task<PutMessagePayload> PutMessageAsync(PutMessageInput input,
            [Service] IHttpContextAccessor accessor,
            [ScopedService] MessagesDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
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

            await context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            return new PutMessagePayload(message);
        }

        [UseDbContext(typeof(MessagesDbContext))]
        public async Task<DeleteMessagePayload> DeleteMessageAsync(DeleteMessageInput input,
            [Service] IHttpContextAccessor accessor,
            [ScopedService] MessagesDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            string userId = accessor.HttpContext!.User.Claims.First().Value;

            Message message = context.Messages.FirstOrDefault(m => m.Id == input.Id);

            if (message is null || message.UserId != userId)
            {
                throw new GraphQLException();
            }

            context.Messages.Remove(message);

            await context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            return new DeleteMessagePayload(message);
        }
    }
}
