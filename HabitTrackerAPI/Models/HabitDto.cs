namespace HabitTrackerAPI.Models
{
  public class HabitDto
  {
      public int Id { get; set; }
      public string Name { get; set; } = "";
      public string Category { get; set; } = "";
      public int Streak { get; set; }
      public List<DateTime> Completions { get; set; } = new();
  }
}
