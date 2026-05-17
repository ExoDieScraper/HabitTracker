using Microsoft.EntityFrameworkCore;
using HabitTrackerAPI.Models;

namespace HabitTrackerAPI.Data
{
    public class HabitTrackerContext : DbContext
    {
        public HabitTrackerContext(DbContextOptions<HabitTrackerContext> options)
            : base(options)
        {
        }

        public DbSet<Habit> Habits { get; set; }

        public DbSet<User> Users { get; set; }
    }
}
