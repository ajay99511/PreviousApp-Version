using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AdminController(UserManager<AppUser> userManager) : BaseApiController
{
    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = await userManager.Users
        .OrderBy(x=>x.UserName)
        .Select(x=> new{
            x.Id,
            Username = x.UserName,
            Roles = x.UserRoles.Select(x=>x.Role.Name).ToList()
        })
        .ToListAsync();
        return Ok(users);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("edit-roles/{username}")]
    public async Task<ActionResult> EditRoles(string username, string roles)
    {
        if(string.IsNullOrEmpty(roles)) return BadRequest("You have select atleast one role");
        var SelectedRoles = roles.Split(",").ToArray();

        var user = await userManager.FindByNameAsync(username);
        if (user == null) return BadRequest("Cannot find User");
        var userRoles = await userManager.GetRolesAsync(user);

        // var rolesToAdd = SelectedRoles.Where(role => !userRoles.Contains(role)).ToList();
        // var rolesToRemove = userRoles.Where(role => !SelectedRoles.Contains(role)).ToList();
        
        var result = await userManager.AddToRolesAsync(user,SelectedRoles.Except(userRoles));
        if(!result.Succeeded) return BadRequest("Failed to add roles");

        result = await userManager.RemoveFromRolesAsync(user,userRoles.Except(SelectedRoles));
        if(!result.Succeeded) return BadRequest("Failed to remove roles");

        return Ok(await userManager.GetRolesAsync(user));

    }

    [Authorize(Policy ="ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public ActionResult GetPhotosForModerator()
    {
        return Ok("Photos only visible to admin");
    }
}