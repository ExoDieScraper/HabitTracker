namespace HabitTrackerAPI.Models
{
    public class Habit
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public int Streak { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    		public bool CompletedToday { get; set; }

    		public DateTime? LastCompletedDate { get; set; }

        public string Category { get; set; } = "General";

        public int UserId { get; set; }

    }
}
