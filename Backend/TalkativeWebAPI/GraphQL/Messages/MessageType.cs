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
                .ResolveWith<Resolvers>(r => r.GetUser(default!, default!))
                .UseDbContext<MessagesDbContext>()
                .Description("This is the user who wrote this message.");

            descriptor
                .Field(m => m.Group)
                .ResolveWith<Resolvers>(r => r.GetGroup(default!, default!))
                .UseDbContext<MessagesDbContext>()
                .Description("This is the group where message was written.");
        }

        private sealed class Resolvers
        {
            public ApplicationUser GetUser(Message message, [ScopedService] MessagesDbContext context)
            {
                return context.Users.FirstOrDefault(u => u.Id == message.UserId);
            }

            public Group GetGroup(Message message, [ScopedService] MessagesDbContext context)
            {
                return context.Groups.FirstOrDefault(g => g.Id == message.GroupId);
            }
        }
    }
}
