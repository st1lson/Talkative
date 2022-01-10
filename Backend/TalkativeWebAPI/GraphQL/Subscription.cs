using HotChocolate;
using HotChocolate.Types;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.GraphQL
{
    public class Subscription
    {
        [Subscribe]
        [Topic]
        public Message OnMessagesChange([EventMessage] Message message)
        {
            return message;
        }
    }
}