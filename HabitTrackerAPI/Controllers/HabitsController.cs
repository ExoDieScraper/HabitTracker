using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HabitTrackerAPI.Data;
using HabitTrackerAPI.Models;

namespace HabitTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitsController : ControllerBase
    {
        private readonly HabitTrackerContext _context;

        public HabitsController(HabitTrackerContext context)
        {
            _context = context;
        }

        // GET: api/habits
        [HttpGet]
        public async Task<ActionResult<List<Habit>>> GetHabits()
        {
            return await _context.Habits.ToListAsync();
        }

        // POST: api/habits
        [HttpPost]
        public async Task<ActionResult<Habit>> CreateHabit(Habit habit)
        {
            _context.Habits.Add(habit);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHabits), new { id = habit.Id }, habit);
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