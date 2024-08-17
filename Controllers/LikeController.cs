using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikeController(IUnitOfWork unitOfWork) : BaseApiController
{
 [HttpPost("{targetUserId:int}")]
 public async Task<ActionResult> ToggleLike( int targetUserId)
 {
    var sourceUserId = User.GetUserId();
    if(sourceUserId == targetUserId) return BadRequest("Cannot Like yourself");
    var existingLike = await unitOfWork.LikeRepository.GetUserLike(sourceUserId,targetUserId);
    if(existingLike == null)
    {
        var like = new UserLike{
            SourceUserId = sourceUserId,
            TargetUserId = targetUserId
        };
        unitOfWork.LikeRepository.AddLike(like);
    }
    else{
        unitOfWork.LikeRepository.DeleteLike(existingLike);
    }
    if(await unitOfWork.Complete()) return Ok();
    return BadRequest("Failed to Save the likes");
 }
[HttpGet("list")]
public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikeIds()
{
    return Ok(await unitOfWork.LikeRepository.GetCurrentUserLikeIds(User.GetUserId()));
}

 [HttpGet]
 public async Task<ActionResult<PagedList<MemberDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
 {
    likesParams.UserId = User.GetUserId();
    var users = await unitOfWork.LikeRepository.GetUserLikes(likesParams);
    Response.AddPaginationHeader(users);
    return Ok(users);
 }
}