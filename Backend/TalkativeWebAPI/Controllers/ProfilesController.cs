using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using TalkativeWebAPI.Data.DbContexts;
using TalkativeWebAPI.Dtos.Profile;
using TalkativeWebAPI.Models;
using TalkativeWebAPI.Services;

namespace TalkativeWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfilesController : Controller
    {
        private readonly MessagesDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly FileUploader _uploader;

        public ProfilesController(
            MessagesDbContext context,
            FileUploader uploader,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _uploader = uploader;
            _userManager = userManager;
        }

        [HttpPut]
        [Route("email")]
        [Authorize(Policy = "Auth")]
        public async Task<IActionResult> ChangeEmail(ChangeEmailInput input)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            string userId = User.Claims.First().Value;
            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.Id == userId);

            string confirmationToken = await _userManager.GenerateChangeEmailTokenAsync(user, input.NewEmail);
            
            IdentityResult result = await _userManager.ChangeEmailAsync(user, input.NewEmail, confirmationToken);
            if (!result.Succeeded)
            {
                return BadRequest(new { Errors = result.Errors });
            }

            return Ok(new { Data = input.NewEmail });
        }

        [HttpPut]
        [Route("password")]
        [Authorize(Policy = "Auth")]
        public async Task<IActionResult> ChangePassword(ChangePasswordInput input)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Error = "The input can not be empty" });
            }

            string userId = User.Claims.First().Value;
            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.Id == userId);
            if (user is null)
            {
                return BadRequest();
            }

            IdentityResult result = await _userManager.ChangePasswordAsync(user, input.CurrentPassword, input.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(new { Errors = result.Errors });
            }

            return Ok(new { Data = input.NewPassword });
        }

        [HttpPost]
        [Route("upload")]
        [Authorize(Policy = "Auth")]
        public async Task<IActionResult> UploadImageAsync([FromForm] UploadProfileImageInput input)
        {
            string fileName = await _uploader.UploadImage(input);
            if (fileName is null)
            {
                return BadRequest();
            }

            string userId = User.Claims.First().Value;
            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.Id == userId);
            if (user is null)
            {
                return BadRequest();
            }

            user.AvatarUrl = fileName;
            _context.Update(user);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
