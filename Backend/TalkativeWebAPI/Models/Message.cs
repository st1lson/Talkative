using System;
using System.ComponentModel.DataAnnotations;

namespace TalkativeWebAPI.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public string Text { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public ApplicationUser User { get; set; }
    }
}
