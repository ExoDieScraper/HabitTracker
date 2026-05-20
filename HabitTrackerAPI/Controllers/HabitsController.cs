using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HabitTrackerAPI.Data;
using HabitTrackerAPI.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace HabitTrackerAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class HabitsController : ControllerBase
    {
        private readonly HabitTrackerContext _context;

        public HabitsController(HabitTrackerContext context)
        {
            _context = context;
        }

        private string GetUsername()
        {
          return User.Identity?.Name!;
        }

        private int getUserId()
        {
          return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        }
        private int CalculateStreak(List<DateTime> dates)
        {
            if (dates.Count == 0) return 0;

            var ordered = dates
                .Select(d => d.Date)
                .Distinct()
                .OrderByDescending(d => d)
                .ToList();

            int streak = 0;
            var today = DateTime.UtcNow.Date;

            for (int i = 0; i < ordered.Count; i++)
            {
                if (i == 0)
                {
                    if (ordered[i] == today || ordered[i] == today.AddDays(-1))
                        streak++;
                    else
                        break;
                }
                else
                {
                    if (ordered[i] == ordered[i - 1].AddDays(-1))
                        streak++;
                    else
                        break;
                }
            }

            return streak;
        }

        // GET: api/habits
        [HttpGet]
        public async Task<ActionResult<List<Habit>>> GetHabits()
        {
            var userId = getUserId();

            var habits = await _context.Habits
                .Include(h => h.Completions)
                .Where(h => h.UserId == userId)
                .ToListAsync();

            var result = habits.Select(h => new HabitDto
            {
                Id = h.Id,
                Name = h.Name,
                Category = h.Category,
                Streak = CalculateStreak(
                    h.Completions.Select(c => c.CompletedAt).ToList()
                ),
                Completions = h.Completions.Select(c => c.CompletedAt).ToList()
            });

            return Ok(result);
        }

        // POST: api/habits
        [HttpPost]
        public async Task<ActionResult<Habit>> CreateHabit(CreateHabitDto dto)
        {
            var userId = getUserId();

            var habit = new Habit
            {
                Name = dto.Name,
                Category = dto.Category,
                UserId = userId
            };

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            return Ok(habit);
        }
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteHabit(int id)
		{
      var userId = getUserId();

      var habit = await _context.Habits
          .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);

      if (habit == null) return NotFound();

      _context.Habits.Remove(habit);
      await _context.SaveChangesAsync();

      return NoContent();
		}

		[HttpPut("{id}/complete")]
		public async Task<IActionResult> CompleteHabit(int id)
		{
      var userId = getUserId();

      var habit = await _context.Habits
          .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);

      if (habit == null)
          return NotFound();

      var today = DateTime.UtcNow.Date;

      var alreadyDone = await _context.HabitCompletions
          .AnyAsync(c => c.HabitId == id && c.CompletedAt.Date == today);

      if (alreadyDone)
          return BadRequest("Already completed today");

      _context.HabitCompletions.Add(new HabitCompletion
      {
          HabitId = id,
          CompletedAt = DateTime.UtcNow
      });

      await _context.SaveChangesAsync();

      return Ok();
  		}
    }
}
