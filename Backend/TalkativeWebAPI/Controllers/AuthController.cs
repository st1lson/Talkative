using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        //[Route("register")]
        //public async Task<IActionResult> Register()
        //{

        //}
    }
}
