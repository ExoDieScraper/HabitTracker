using System.Text.Json.Serialization;
namespace HabitTrackerAPI.Models
{
  public class Habit
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Category { get; set; } = "";

        public int UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; } = null!;

        public List<HabitCompletion> Completions { get; set; } = new();
    }
}
