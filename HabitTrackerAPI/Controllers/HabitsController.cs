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
    }
}