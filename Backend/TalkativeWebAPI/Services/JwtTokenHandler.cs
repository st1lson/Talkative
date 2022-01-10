using TalkativeWebAPI.Data.DbContexts;

namespace TalkativeWebAPI.Services
{
    public class JwtTokenHandler
    {
        private readonly RefreshTokensDbContext _context;
        private readonly JwtTokenCreator _tokenCreator;

        public JwtTokenHandler(RefreshTokensDbContext context, JwtTokenCreator tokenCreator)
        {
            _context = context;
            _tokenCreator = tokenCreator;
        }
    }
}