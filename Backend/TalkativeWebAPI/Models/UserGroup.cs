using System.ComponentModel.DataAnnotations;

namespace TalkativeWebAPI.Models
{
    public class UserGroup
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string GroupId { get; set; }

        [Required]
        public string UserId { get; set; }

        public Group Group { get; set; }

        public ApplicationUser User { get; set; }
    }
}
