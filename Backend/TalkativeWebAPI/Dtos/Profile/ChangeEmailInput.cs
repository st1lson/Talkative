using System.ComponentModel.DataAnnotations;
namespace TalkativeWebAPI.Dtos.Profile
{
    public class ChangeEmailInput
    {
        [Required]
        public string NewEmail { get; set; }
    }
}