using System.ComponentModel.DataAnnotations;

namespace TalkativeWebAPI.Dtos.Profile
{
    public class ChangeUsernameInput
    {
        [Required]
        public string NewUserName { get; set; }
    }
}