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
using TalkativeWebAPI.GraphQL.Groups;
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

            if (!IsJoinedGroup(userId, input.GroupId, context))
            {
                throw new GraphQLException();
            }

            Message message = new()
            {
                Text = sanitizer.Sanitize(input.Text),
                UserId = userId,
                GroupId = input.GroupId,
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

            await SubscribeAsync(input.GroupId, context, accessor,
                eventSender, cancellationToken).ConfigureAwait(false);

            return new AddMessagePayload(messageDto);
        }

        [Authorize(Policy = "Auth")]
        [UseDbContext(typeof(MessagesDbContext))]
        public async Task<AddGroupPayload> AddGroupAsync(AddGroupInput input,
            [Service] IHttpContextAccessor accessor,
            [ScopedService] MessagesDbContext context)
        {
            HtmlSanitizer sanitizer = new();
            string userId = accessor.HttpContext!.User.Claims.First().Value;

            Group group = new()
            {
                Name = sanitizer.Sanitize(input.Name),
                CreatorId = userId,
                CreationDate = DateTime.Now
            };

            context.Groups.Add(group);
            await context.SaveChangesAsync().ConfigureAwait(false);

            return new AddGroupPayload(group);
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
            PutMessageInput sanitizedInput = new(input.GroupId, input.Id, sanitizer.Sanitize(input.Text));

            string userId = accessor.HttpContext!.User.Claims.First().Value;
            string userName = context.Users.FirstOrDefault(u => u.Id == userId)?.UserName;

            if (!IsJoinedGroup(userId, input.GroupId, context))
            {
                throw new GraphQLException();
            }

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

            await SubscribeAsync(input.GroupId, context, accessor,
                eventSender, cancellationToken).ConfigureAwait(false);

            return new PutMessagePayload(messageDto);
        }

        [UseDbContext(typeof(MessagesDbContext))]
        public async Task<PutGroupPayload> PutGroupAsync(PutGroupInput input,
            [Service] IHttpContextAccessor accessor,
            [ScopedService] MessagesDbContext context)
        {
            HtmlSanitizer sanitizer = new();
            PutGroupInput sanitizedInput = new(input.GroupId, sanitizer.Sanitize(input.Name));

            string userId = accessor.HttpContext!.User.Claims.First().Value;

            Group group = context.Groups.FirstOrDefault(g => g.Id == sanitizedInput.GroupId);

            if (group is null || group.CreatorId != userId)
            {
                throw new GraphQLException();
            }

            group.Name = sanitizedInput.Name;

            await context.SaveChangesAsync().ConfigureAwait(false);

            return new PutGroupPayload(group);
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

            if (!IsJoinedGroup(userId, input.GroupId, context))
            {
                throw new GraphQLException();
            }

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

            await SubscribeAsync(input.GroupId, context, accessor,
                eventSender, cancellationToken).ConfigureAwait(false);

            return new DeleteMessagePayload(messageDto);
        }

        private static bool IsJoinedGroup(string userId, int groupId, MessagesDbContext context)
        {
            UserGroup userGroup =
                context.UserGroups.FirstOrDefault(ug => ug.UserId == userId && ug.GroupId == groupId);

            return userGroup is not null;
        }

        private static async Task SubscribeAsync(
            int groupId,
            MessagesDbContext context,
            IHttpContextAccessor accessor,
            ITopicEventSender eventSender,
            CancellationToken cancellationToken)
        {
            IEnumerable<MessageDto> messages = context.Messages.Where(m => m.GroupId == groupId).Select(contextMessage => new MessageDto
            {
                Id = contextMessage.Id,
                Text = contextMessage.Text,
                Date = contextMessage.Date,
                GroupId = contextMessage.GroupId,
                UserName = context.Users.FirstOrDefault(u => u.Id == contextMessage.UserId)!.UserName
            }).ToArray();

            string header = accessor.HttpContext!.Request.Headers["Authorization"].ToString();
            string topic = "OnMessagesChange_Group_" + groupId + "_" + header.Split(" ")[1];

            await eventSender.SendAsync(topic, new OnMessagesChange(messages.OrderBy(m => m.Date)), cancellationToken).ConfigureAwait(false);
        }
    }
}
