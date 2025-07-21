using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DotnetPostgresApi.Models;

public record RegisterDto(string Email, string Username, string Password, string FullName, string Company);
public record LoginDto(string Username, string Password);

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AccountController> _logger;

    public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IConfiguration configuration, ILogger<AccountController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        var user = new AppUser
        {
            UserName = registerDto.Username,
            Email = registerDto.Email,
            FullName = registerDto.FullName,
            Company = registerDto.Company
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "User creation failed! Please check user details and try again." });
        }

        return Ok(new { Status = "Success", Message = "User created successfully!" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var result = await _signInManager.PasswordSignInAsync(loginDto.Username, loginDto.Password, false, false);
        if (!result.Succeeded)
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByNameAsync(loginDto.Username);
        var token = GenerateJwtToken(user);

        return Ok(new { Token = token });
    }

    private string GenerateJwtToken(AppUser user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        _logger.LogInformation("--- GetProfile --- Attempting to find user with ID from token: {UserId}", userId);
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(new
        {
            user.Id,
            user.UserName,
            user.Email,
            user.FullName,
            user.Company
        });
    }

    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsers()
    {
        var users = _userManager.Users.ToList();
        return Ok(users);
    }

    [HttpGet("user/{id}")]
    [Authorize]
    public async Task<IActionResult> GetUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPut("user/{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateUser(string id, AppUser updatedUser)
    {
        if (id != updatedUser.Id)
        {
            return BadRequest();
        }

        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        user.UserName = updatedUser.UserName;
        user.Email = updatedUser.Email;
        user.FullName = updatedUser.FullName;
        user.Company = updatedUser.Company;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "User update failed!" });
        }

        return Ok(new { Status = "Success", Message = "User updated successfully!" });
    }

    [HttpDelete("user/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "User deletion failed!" });
        }

        return Ok(new { Status = "Success", Message = "User deleted successfully!" });
    }
}