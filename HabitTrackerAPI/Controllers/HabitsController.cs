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

        // GET: api/habits
        [HttpGet]
        public async Task<ActionResult<List<Habit>>> GetHabits()
        {
          var userId = getUserId();

          return await _context.Habits
            .Where(h => h.UserId == userId)
            .ToListAsync();
        }

        // POST: api/habits
        [HttpPost]
        public async Task<ActionResult<Habit>> CreateHabit(Habit habit)
        {
            habit.UserId = getUserId();

            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            return Ok(habit);
        }
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteHabit(int id)
		{
			var habit = await _context.Habits.FindAsync(id);
			if (habit == null) return NotFound();

			_context.Habits.Remove(habit);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		[HttpPut("{id}/complete")]
		public async Task<IActionResult> CompleteHabit(int id)
		{
			var habit = await _context.Habits.FindAsync(id);

			if (habit == null)
			{
				return NotFound();
			}

			var today = DateTime.UtcNow.Date;

			// Already completed today
			if (habit.LastCompletedDate?.Date == today)
			{
				return BadRequest("Habit already completed today.");
			}

			// If completed yesterday → continue streak
			if (habit.LastCompletedDate?.Date == today.AddDays(-1))
			{
				habit.Streak++;
			}
			else
			{
				// Missed a day → reset streak
				habit.Streak = 1;
			}

			habit.CompletedToday = true;
			habit.LastCompletedDate = today;

			await _context.SaveChangesAsync();

			return Ok(habit);
		}
    }
}
