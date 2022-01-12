using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using TalkativeWebAPI.Models;
using TalkativeWebAPI.Models.Auth;
using TalkativeWebAPI.Services;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace TalkativeWebAPI.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly JwtTokenCreator _tokenCreator;
        private readonly JwtRefreshTokenHandler _refreshTokenHandler;

        public AuthController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IHttpContextAccessor accessor,
            JwtTokenCreator tokenCreator,
            JwtRefreshTokenHandler refreshTokenHandler)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenCreator = tokenCreator;
            _refreshTokenHandler = refreshTokenHandler;
        }

        [Route("register")]
        public async Task<IActionResult> Register(RegisterInput input)
        {
            ApplicationUser user = new()
            {
                UserName = input.UserName,
                Email = input.Email
            };

            if (_userManager.Users.Any(u => u.UserName == input.UserName || u.Email == input.Email))
            {
                return BadRequest();
            }

            IdentityResult result = await _userManager.CreateAsync(user, input.Password).ConfigureAwait(false);

            if (!result.Succeeded)
            {
                return BadRequest();
            }

            await _signInManager.SignInAsync(user, false).ConfigureAwait(false);

            var (refreshToken, _) = await _refreshTokenHandler.WriteIfExpiredAsync(user).ConfigureAwait(false);

            var (authToken, _) = _tokenCreator.CreateToken(user);

            return Ok(new LoginPayload(authToken, refreshToken, user.UserName));
        }

        [Route("login")]
        public async Task<IActionResult> Login(LoginInput input)
        {
            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.UserName == input.UserName);

            if (user is null)
            {
                return BadRequest();
            }

            SignInResult result = await _signInManager
                .PasswordSignInAsync(user, input.Password, isPersistent: false, lockoutOnFailure: false)
                .ConfigureAwait(false);

            if (!result.Succeeded)
            {
                return BadRequest();
            }

            var (refreshToken, _) = await _refreshTokenHandler.WriteIfExpiredAsync(user).ConfigureAwait(false);

            var (authToken, _) = _tokenCreator.CreateToken(user);

            return Ok(new LoginPayload(authToken, refreshToken, user.UserName));
        }

        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync().ConfigureAwait(false);

            return Ok();
        }
    }
}
