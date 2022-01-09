using System.ComponentModel.DataAnnotations;

namespace TalkativeWebAPI.Models
{
    public class Message
    {
        [Key]
        public string Id { get; set; }

        [Required]
        public string Text { get; set; }

        [Required]
        public string Author { get; set; }
    }
}
