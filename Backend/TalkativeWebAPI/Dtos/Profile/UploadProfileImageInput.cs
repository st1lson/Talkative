using Microsoft.AspNetCore.Http;

namespace TalkativeWebAPI.Dtos.Profile
{
    public record UploadProfileImageInput(IFormFile Image);
}
