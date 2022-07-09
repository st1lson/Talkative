using System.ComponentModel.DataAnnotations;
namespace TalkativeWebAPI.Dtos.Profile
{
    public class ChangePasswordInput
    {
        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        public string NewPassword { get; set; }
    }
}