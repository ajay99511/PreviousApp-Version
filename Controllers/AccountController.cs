using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class AccountController(UserManager<AppUser> userManager,ITokenService tokenService,IMapper mapper): BaseApiController
{
    [HttpPost("register")]
    ///public async Task<ActionResult<AppUser>>Register(RegisterDto registerDto)
    public async Task<ActionResult<UserDto>>Register(RegisterDto registerDto)
    {
        if(await UserExists(registerDto.username))
        {
            return BadRequest("UserName ALready Exists");
        }
        var user = mapper.Map<AppUser>(registerDto);
        user.UserName = registerDto.username.ToLower();
        var result = await userManager.CreateAsync(user,registerDto.password);
        if(!result.Succeeded) return BadRequest(result.Errors);
        // using var hmac = new HMACSHA512();
        // user.passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.password));
        // user.passwordSalt = hmac.Key;
        // context.Users.Add(user);
        // await context.SaveChangesAsync();
        // var user = new AppUser
        // {
        // UserName = registerDto.Username.ToLower(),
        // PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
        // PasswordSalt = hmac.Key
        // };

        return new UserDto
        {
        Username = user.UserName,
        Token = await tokenService.CreateToken(user),
        KnownAs = user.KnownAs,
        Gender = user.Gender,
        };
    }
    [HttpPost("login")]
    //public async Task<ActionResult<AppUser>>Login(LoginDto loginDto)
    public async Task<ActionResult<UserDto>>Login(LoginDto loginDto)
    {
        var user = await userManager.Users
        .Include(p=>p.Photos)
        .FirstOrDefaultAsync(x=>
        x.NormalizedUserName ==loginDto.username.ToUpper());
        if(user == null || user.UserName == null) return Unauthorized("Invalid UserName");
        // using var hmac = new HMACSHA512(user.passwordSalt);
        // var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.password));
        // for(int i=0;i<computeHash.Length;i++)
        // {
        //     if(computeHash[i]!=user.passwordHash[i])
        //     {
        //         return Unauthorized("InvalidPassword");
        //     }
        // }
        return new UserDto{
                Username = user.UserName,
                KnownAs = user.KnownAs,
                Gender = user.Gender,
                Token= await tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(p=>p.IsMain)?.Url
        };
    }
    private async Task <bool>UserExists(string username)
    {
        return await userManager.Users.AnyAsync(x=>x.NormalizedUserName == username.ToUpper());
        // x=>x.UserName.ToLower() == username.ToLower()
    }
}
