using Microsoft.AspNetCore.Identity;

namespace DotnetPostgresApi.Models
{
    public class AppUser : IdentityUser
    {
        // Additional properties can be added here if needed
        public string? FullName { get; set; }
        public string? Company { get; set; }
    }
}