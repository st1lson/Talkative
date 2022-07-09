using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
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
