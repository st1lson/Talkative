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
        public IQueryable<Group> GetGroup([Service] IHttpContextAccessor accessor,
            [ScopedService] MessagesDbContext context)
        {
            string userId = accessor.HttpContext!.User.Claims.First().Value;

            return context.UserGroups
                .Where(ug => ug.UserId == context.Users.First().Id)
                .Select(ug => ug.Group);
        }
    }
}
