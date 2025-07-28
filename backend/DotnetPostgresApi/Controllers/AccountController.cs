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
    private readonly RoleManager<IdentityRole> _roleManager;

    public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IConfiguration configuration, ILogger<AccountController> logger, RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _logger = logger;
        _roleManager = roleManager;
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

        if (!await _roleManager.RoleExistsAsync("User"))
        {
            await _roleManager.CreateAsync(new IdentityRole("User"));
        }
        await _userManager.AddToRoleAsync(user, "User");

        return Ok(new { Status = "Success", Message = "User created successfully!" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        AppUser? user = null;
        user = await _userManager.FindByNameAsync(loginDto.Username);

        if (user == null)
        {
            user = await _userManager.FindByEmailAsync(loginDto.Username);
        }
        
        if (user == null)
        {
            _logger.LogError("User not found during login attempt: {Username}", loginDto.Username);
            return StatusCode(StatusCodes.Status404NotFound, new { Status = "Error", Message = "Invalid login credentials." });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
        if (!result.Succeeded)
        {
            _logger.LogWarning("Invalid login attempt for user: {Username}", loginDto.Username);
            return StatusCode(StatusCodes.Status401Unauthorized, new { Status = "Error", Message = "Invalid login credentials." });
        }        

        var token = await GenerateJwtToken(user);
        return Ok(new { Token = token });
    }

    private async Task<string> GenerateJwtToken(AppUser user)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName),
        };

        var roles = await _userManager.GetRolesAsync(user);
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

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
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            user.Id,
            user.UserName,
            user.Email,
            user.FullName,
            user.Company,
            Roles = roles
        });
    }

    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsers()
    {
        var users = _userManager.Users.ToList();
        var usersWithRoles = new List<object>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            usersWithRoles.Add(new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.FullName,
                user.Company,
                Roles = roles
            });
        }

        return Ok(usersWithRoles);
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
        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            user.Id,
            user.UserName,
            user.Email,
            user.FullName,
            user.Company,
            Roles = roles
        });
    }

    [HttpPut("user/{id}")]
    [Authorize(Roles = "Admin, User")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UserUpdateDto updatedUser)
    {
        if (!User.IsInRole("Admin") && User.FindFirstValue(ClaimTypes.NameIdentifier) != id)
        {
            return Forbid("You do not have permission to update this user's profile.");
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
            return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "User update failed!", Errors = result.Errors.Select(e => e.Description) });
        }

        if (User.IsInRole("Admin") && updatedUser.Roles != null)
        {
            var currentRoles = await _userManager.GetRolesAsync(user);
            var rolesToAdd = updatedUser.Roles.Except(currentRoles);
            var rolesToRemove = currentRoles.Except(updatedUser.Roles);

            foreach (var roleName in rolesToAdd)
            {
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    await _roleManager.CreateAsync(new IdentityRole(roleName));
                }
                await _userManager.AddToRoleAsync(user, roleName);
            }

            await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
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

public record UserUpdateDto(string UserName, string Email, string FullName, string Company, List<string>? Roles);