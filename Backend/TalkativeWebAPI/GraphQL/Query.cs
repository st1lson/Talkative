using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Data;
using Microsoft.AspNetCore.Http;
using System.Linq;
using TalkativeWebAPI.Data.DbContexts;
using TalkativeWebAPI.Dtos;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.GraphQL
{
    public class Query
    {
        [Authorize(Policy = "Auth")]
        [UseDbContext(typeof(MessagesDbContext))]
        [UseFiltering]
        [UseSorting]
        public IQueryable<MessageDto> GetMessage([Service] IHttpContextAccessor accessor,
            [ScopedService] MessagesDbContext context)
        {
            IQueryable<MessageDto> messages = context.Messages.Select(contextMessage => new MessageDto
            {
                Id = contextMessage.Id,
                Text = contextMessage.Text,
                Date = contextMessage.Date,
                GroupId = contextMessage.GroupId,
                UserName = context.Users.FirstOrDefault(u => u.Id == contextMessage.UserId)!.UserName
            });

            return messages;
        }

        [Authorize(Policy = "Auth")]
        [UseDbContext(typeof(MessagesDbContext))]
        [UseFiltering]
        [UseSorting]
        public IQueryable<ApplicationUser> GetUser([Service] IHttpContextAccessor accessor,
            [ScopedService] MessagesDbContext context)
        {
            string userId = accessor.HttpContext!.User.Claims.First().Value;

            return context.Users.Where(u => u.Id == userId);
        }

        [Authorize(Policy = "Auth")]
        [UseDbContext(typeof(MessagesDbContext))]
        [UseFiltering]
        [UseSorting]
        public IQueryable<GroupDto> GetGroup([Service] IHttpContextAccessor accessor,
            [ScopedService] MessagesDbContext context)
        {
            string userId = accessor.HttpContext!.User.Claims.First().Value;

            IQueryable<GroupDto> groups = context.UserGroups
                .Where(ug => ug.UserId == userId)
                .Select(ug => ug.Group)
                .Select(g => new GroupDto()
                {
                    Id = g.Id,
                    Name = g.Name,
                    LastMessage = g.Messages
                        .OrderBy(m => m.Date)
                        .Select(m => new MessageDto()
                        {
                            Id = m.Id,
                            Text = m.Text,
                            Date = m.Date,
                            GroupId = m.GroupId,
                            UserName = context.Users.FirstOrDefault(u => u.Id == m.UserId)!.UserName
                        })
                        .FirstOrDefault()
                });

            return groups;
        }
    }
}
