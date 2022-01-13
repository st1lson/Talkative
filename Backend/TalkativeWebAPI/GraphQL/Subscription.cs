using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
using System.Threading;
using System.Threading.Tasks;
using TalkativeWebAPI.GraphQL.Messages;

namespace TalkativeWebAPI.GraphQL
{
    public class Subscription
    {
        [Subscribe(With = nameof(SubscribeToMessagesChangeAsync))]
        [Topic]
        public OnMessagesChange OnMessagesChange(string jwtToken,
            [EventMessage] OnMessagesChange messages)
        {
            return messages;
        }

        public async ValueTask<ISourceStream<OnMessagesChange>> SubscribeToMessagesChangeAsync(
            string jwtToken,
            [Service] ITopicEventReceiver eventReceiver,
            CancellationToken cancellationToken)
        {
            return await eventReceiver.SubscribeAsync<string, OnMessagesChange>("OnMessagesChange_" + jwtToken, cancellationToken).ConfigureAwait(false);
        }
    }
}