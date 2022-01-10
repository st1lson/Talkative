using HotChocolate;
using HotChocolate.Types;
using System.Linq;
using TalkativeWebAPI.Data.DbContexts;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.GraphQL.ApplicationUsers
{
    public class ApplicationUserType : ObjectType<ApplicationUser>
    {
        protected override void Configure(IObjectTypeDescriptor<ApplicationUser> descriptor)
        {
            descriptor.Description("");

            base.Configure(descriptor);
            descriptor
                .Field(u => u.Messages)
                .ResolveWith<Resolvers>(u => u.GetUsers(default!, default!))
                .UseDbContext<MessagesDbContext>()
                .Description("This is the list of messages which was created by separate user.");
        }

        private sealed class Resolvers
        {
            public IQueryable<Message> GetUsers(ApplicationUser user, [ScopedService] MessagesDbContext context)
            {
                return context.Messages.Where(m => m.UserId == user.Id);
            }
        }
    }
}
