using System.Net.WebSockets;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class AccountController(DataContext context,ITokenService tokenService): BaseApiController
{
    [HttpPost("register")]
    ///public async Task<ActionResult<AppUser>>Register(RegisterDto registerDto)
    public async Task<ActionResult<UserDto>>Register(RegisterDto registerDto)
    {
        if(await UserExists(registerDto.username))
        {
            return BadRequest("UserName ALready Exists");
        }
        var hmac = new HMACSHA512();       
        var user =new AppUser{
            UserName = registerDto.username.ToLower(),
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.password)),
            passwordSalt = hmac.Key
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();
        //return user;
        return new UserDto{
            Username=user.UserName,
            Token = tokenService.CreateToken(user)
        };
    }
    [HttpPost("login")]
    //public async Task<ActionResult<AppUser>>Login(LoginDto loginDto)
    public async Task<ActionResult<UserDto>>Login(LoginDto loginDto)
    {
        var user = await context.Users.FirstOrDefaultAsync(x=>
        x.UserName ==loginDto.username.ToLower());
        if(user == null) return Unauthorized("Invalid UserName");
        using var hmac = new HMACSHA512(user.passwordSalt);
        var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.password));
        for(int i=0;i<computeHash.Length;i++)
        {
            if(computeHash[i]!=user.passwordHash[i])
            {
                return Unauthorized("InvalidPassword");
            }
        }
        return new UserDto{
                Username = user.UserName,
                Token= tokenService.CreateToken(user)
        };
    }
    private async Task <bool>UserExists(string username)
    {
        return await context.Users.AnyAsync(x=>x.UserName.ToLower() == username.ToLower());
    }
}
