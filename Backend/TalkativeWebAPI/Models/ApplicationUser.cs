using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace TalkativeWebAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string AvatarUrl { get; set; }

        public List<Group> Groups { get; set; } = new();

        public List<UserGroup> UserGroups { get; set; } = new();

        public List<Message> Messages { get; set; } = new();
    }
}
