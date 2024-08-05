using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
public class BuggyController(DataContext context) :BaseApiController
{
    [Authorize]
    [HttpGet("auth")]
    public ActionResult<string>GetAuth()
    {
        return "Errorrrrrr";
    }
    [HttpGet("not-found")]
    public ActionResult<AppUser>GetNotFound()
    {
        var t = context.Users.Find(-1);
        if(t==null) return NotFound();
        return t;
    }
    [HttpGet("server-error")]
    public ActionResult<AppUser>GetServerError()
    {
        try{
            var t = context.Users.Find(-1) ?? throw new Exception("Something's Wrong");
            return t;
        }
        catch(Exception ex)
        {
            return StatusCode(500,ex);
        }
    }
    [HttpGet("bad-request")]
    public ActionResult<string>GetBadRequest()
    {
        return BadRequest("This was a bad request");
    }
}