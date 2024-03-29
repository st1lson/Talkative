﻿using HotChocolate;
using HotChocolate.Types;
using System.Linq;
using TalkativeWebAPI.Data.DbContexts;
using TalkativeWebAPI.GraphQL.Messages;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.GraphQL.Groups
{
    public class GroupType : ObjectType<Group>
    {
        protected override void Configure(IObjectTypeDescriptor<Group> descriptor)
        {
            descriptor.Description("Represents a group.");

            descriptor
                .Field(g => g.Creator)
                .ResolveWith<Resolvers>(r => r.GetCreator(default!, default!))
                .UseDbContext<MessagesDbContext>()
                .Description("User who was created the specified group.");

            descriptor
                .Field(g => g.UserGroups)
                .ResolveWith<Resolvers>(r => r.GetUsers(default!, default!))
                .UseDbContext<MessagesDbContext>()
                .Description("All participants of the specified group.");

            descriptor
                .Field(g => g.Messages)
                .ResolveWith<Resolvers>(r => r.GetMessages(default!, default!))
                .UsePaging<MessageType>()
                .UseDbContext<MessagesDbContext>()
                .Description("All messages which were written in the specified group.");
        }

        private sealed class Resolvers
        {
            public ApplicationUser GetCreator(Group group, [ScopedService] MessagesDbContext context)
            {
                return context.Users.FirstOrDefault(u => u.Id == group.CreatorId);
            }

            public IQueryable<ApplicationUser> GetUsers(Group group, [ScopedService] MessagesDbContext context)
            {
                return context.UserGroups
                    .Where(ug => ug.GroupId == group.Id)
                    .Select(ug => ug.User);
            }

            public IQueryable<Message> GetMessages(Group group, [ScopedService] MessagesDbContext context)
            {
                return context.Messages.Where(m => m.GroupId == group.Id);
            }
        }
    }
}
