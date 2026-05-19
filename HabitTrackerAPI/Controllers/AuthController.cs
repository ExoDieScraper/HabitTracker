using BCrypt.Net;
using HabitTrackerAPI.Data;
using HabitTrackerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HabitTrackerAPI.Controllers;

[ApiController]
[Route ("api/[controller]")]
public class AuthController : ControllerBase
{
  private readonly HabitTrackerContext _context;
  private readonly IConfiguration _configuration;

  public AuthController(HabitTrackerContext context, IConfiguration configuration)
  {
    _context = context;
    _configuration = configuration;
  }

  [HttpPost("register")]
  public IActionResult Register(User request)
  {
    if (string.IsNullOrWhiteSpace(request.Username))
    {
      return BadRequest("Username is required");
    }
    if (string.IsNullOrWhiteSpace(request.PasswordHash))
    {
      return BadRequest("Password is required");
    }
    if (request.PasswordHash.Length < 8)
    {
      return BadRequest("Password must be at least 8 characters long");
    }
    var existingUser = _context.Users
        .FirstOrDefault(u => u.Username == request.Username);
    if (existingUser != null)
    {
      return BadRequest("Username already exists");
    }
    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.PasswordHash);

    var user = new User
    {
      Username = request.Username,
      PasswordHash = hashedPassword
    };

    _context.Users.Add(user);
    _context.SaveChanges();

    return Ok("User created");
  }

  [HttpPost("login")]
  public IActionResult Login(User request)
  {
    var user = _context.Users
        .FirstOrDefault(u => u.Username == request.Username);

    if (user == null)
    {
      return BadRequest("User not found");
    }

    bool passwordValid = BCrypt.Net.BCrypt.Verify(
        request.PasswordHash,
        user.PasswordHash
    );

    if (!passwordValid)
    {
      return BadRequest("Wrong password");
    }

    var claims = new[]
    {
      new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
      new Claim(ClaimTypes.Name, user.Username)
    };

    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(
          _configuration["Jwt:Key"]!
        )
    );

    var creds = new SigningCredentials(
        key,
        SecurityAlgorithms.HmacSha256
    );

    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.Now.AddDays(1),
        signingCredentials: creds
    );

    var jwt = new JwtSecurityTokenHandler()
        .WriteToken(token);

    return Ok(jwt);
  }
}
