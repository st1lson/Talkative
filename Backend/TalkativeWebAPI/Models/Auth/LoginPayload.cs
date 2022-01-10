namespace TalkativeWebAPI.Models.Auth
{
    public record LoginPayload(string JwtToken, string RefreshToken, string UserName);
}