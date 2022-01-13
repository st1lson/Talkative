using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Subscriptions;
using Microsoft.AspNetCore.Http;
using TalkativeWebAPI.Data.DbContexts;
using TalkativeWebAPI.Dtos;
using TalkativeWebAPI.GraphQL.Messages;

namespace TalkativeWebAPI.Services
{
    public static class SubscriptionHandler
    {
        public static async Task SubscribeAsync(MessagesDbContext context,
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
