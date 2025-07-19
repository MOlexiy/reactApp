using Microsoft.EntityFrameworkCore;
using DotnetPostgresApi.Models;

namespace DotnetPostgresApi.Data
{
    public class ApiDbContext : DbContext
    {
        public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
        {
        }

        public DbSet<Item> Items { get; set; } = null;

        // protected override void OnModelCreating(ModelBuilder modelBuilder)
        // {
        //     modelBuilder.Entity<Item>().ToTable("items");
        //     base.OnModelCreating(modelBuilder);
        // }
    }
}