using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using TalkativeWebAPI.Data.DbContexts;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.Services
{
    public class JwtRefreshTokenHandler
    {
        private readonly RefreshTokensDbContext _context;
        private readonly JwtTokenCreator _tokenCreator;

        public JwtRefreshTokenHandler(RefreshTokensDbContext context, JwtTokenCreator tokenCreator)
        {
            _context = context;
            _tokenCreator = tokenCreator;
        }
        public async Task<(string Token, DateTime Expires)> WriteIfExpiredAsync(ApplicationUser user)
        {
            RefreshToken prevToken = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.UserId == user.Id).ConfigureAwait(false);

            if (prevToken is not null)
            {
                if (prevToken.Expires > DateTime.Now)
                {
                    return (prevToken.Token, prevToken.Expires);
                }

                _context.RefreshTokens.Remove(prevToken);
            }

            var refreshToken = _tokenCreator.CreateToken(user);

            RefreshToken newToken = new()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = user.Id,
                Token = refreshToken.Token,
                Expires = refreshToken.Expires
            };
            _context.RefreshTokens.Add(newToken);

            await _context.SaveChangesAsync().ConfigureAwait(false);

            return refreshToken;
        }

        public async Task<bool> IsTokenValidAsync(string token)
        {
            RefreshToken refreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == token).ConfigureAwait(false);

            return refreshToken is not null && refreshToken.Expires > DateTime.Now;
        }
    }
}