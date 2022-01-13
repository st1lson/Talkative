using Ganss.XSS;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using HotChocolate.Subscriptions;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TalkativeWebAPI.Data.DbContexts;
using TalkativeWebAPI.Dtos;
using TalkativeWebAPI.GraphQL.Messages;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.GraphQL
{
    public class Mutation
    {
        [Authorize(Policy = "Auth")]
        [UseDbContext(typeof(MessagesDbContext))]
        public async Task<AddMessagePayload> AddMessageAsync(AddMessageInput input,
            [Service] IHttpContextAccessor accessor,
            [ScopedService] MessagesDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            HtmlSanitizer sanitizer = new();
            string userId = accessor.HttpContext!.User.Claims.First().Value;
            string userName = context.Users.FirstOrDefault(u => u.Id == userId)?.UserName;

            Message message = new()
            {
                Text = sanitizer.Sanitize(input.Text),
                UserId = userId,
                Date = DateTime.Now
            };

            context.Messages.Add(message);
            await context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            MessageDto messageDto = new()
            {
                Id = message.Id,
                Text = message.Text,
                Date = message.Date,
                UserName = userName
            };

            await SubscribeAsync(context, accessor,
                eventSender, cancellationToken).ConfigureAwait(false);

            return new AddMessagePayload(messageDto);
        }

        [Authorize(Policy = "Auth")]
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
            string userName = context.Users.FirstOrDefault(u => u.Id == userId)?.UserName;

            Message message = context.Messages.FirstOrDefault(m => m.Id == sanitizedInput.Id);

            if (message is null || message.UserId != userId)
            {
                throw new GraphQLException();
            }

            message.Text = sanitizedInput.Text;

            await context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            MessageDto messageDto = new()
            {
                Id = message.Id,
                Text = message.Text,
                Date = message.Date,
                UserName = userName
            };

            await SubscribeAsync(context, accessor,
                eventSender, cancellationToken).ConfigureAwait(false);

            return new PutMessagePayload(messageDto);
        }

        [Authorize(Policy = "Auth")]
        [UseDbContext(typeof(MessagesDbContext))]
        public async Task<DeleteMessagePayload> DeleteMessageAsync(DeleteMessageInput input,
            [Service] IHttpContextAccessor accessor,
            [ScopedService] MessagesDbContext context,
            [Service] ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            string userId = accessor.HttpContext!.User.Claims.First().Value;
            string userName = context.Users.FirstOrDefault(u => u.Id == userId)?.UserName;

            Message message = context.Messages.FirstOrDefault(m => m.Id == input.Id);

            if (message is null || message.UserId != userId)
            {
                throw new GraphQLException();
            }

            context.Messages.Remove(message);

            await context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            MessageDto messageDto = new()
            {
                Id = message.Id,
                Text = message.Text,
                Date = message.Date,
                UserName = userName
            };

            await SubscribeAsync(context, accessor,
                eventSender, cancellationToken).ConfigureAwait(false);

            return new DeleteMessagePayload(messageDto);
        }

        private static async Task SubscribeAsync(MessagesDbContext context,
            IHttpContextAccessor accessor,
            ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            string userId = accessor.HttpContext?.User.Claims.First().Value;
            string userName = context.Users.FirstOrDefault(u => u.Id == userId)!.UserName;

            IEnumerable<MessageDto> messages = context.Messages.Select(contextMessage => new MessageDto
            {
                Id = contextMessage.Id,
                Text = contextMessage.Text,
                Date = contextMessage.Date,
                UserName = userName
            }).ToList();

            string header = accessor.HttpContext!.Request.Headers["Authorization"].ToString();
            string topic = "OnMessagesChange_" + header.Split(" ")[1];

            await eventSender.SendAsync(topic, new OnMessagesChange(messages), cancellationToken).ConfigureAwait(false);
        }
    }
}
