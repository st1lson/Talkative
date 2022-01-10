using HotChocolate;
using HotChocolate.Types;
using System.Linq;
using TalkativeWebAPI.Data.DbContexts;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.GraphQL.Messages
{
    public class MessageType : ObjectType<Message>
    {
        protected override void Configure(IObjectTypeDescriptor<Message> descriptor)
        {
            descriptor.Description("Represents a message.");

            descriptor
                .Field(m => m.User)
                .ResolveWith<Resolvers>(m => m.GetUser(default!, default!))
                .UseDbContext<MessagesDbContext>()
                .Description("This is the user who wrote this message.");
        }

        private sealed class Resolvers
        {
            public ApplicationUser GetUser(Message message, [ScopedService] MessagesDbContext context)
            {
                return context.Users.FirstOrDefault(u => u.Id == message.UserId);
            }
        }
    }
}
