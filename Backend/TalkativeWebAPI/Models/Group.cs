using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TalkativeWebAPI.Models
{
    public class Group
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string CreatorId { get; set; }

        [Required]
        public DateTime CreationDate { get; set; }

        public ApplicationUser Creator { get; set; }

        public List<UserGroup> UserGroups { get; set; } = new();

        public List<Message> Messages { get; set; } = new();
    }
}
