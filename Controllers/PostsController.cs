// 




using API.Controllers;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
public class PostsController(IUnitOfWork unitOfWork) : BaseApiController
{

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PostDto>>> GetUserPosts()
    {
        var posts = await unitOfWork.PostRepository.GetUserPost(User.GetUsername());
        return Ok(posts);
    }

    [HttpPost]
    public async Task<ActionResult<PostDto>> CreatePost(CreatePostDto createPostDto)
    {
        var username = User.GetUsername();
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
        if (user == null) return BadRequest("User Not Logged In");

        var post = new Post
        {
            CreatorName = username,
            Description = createPostDto.Description,
            PhotoUrl = createPostDto.PicUrl,
            CreatorId = user.Id,
        };

        unitOfWork.PostRepository.AddPost(post);
        await unitOfWork.Complete();
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePost(int id)
    {
        var username = User.GetUsername();
        var post = await unitOfWork.PostRepository.GetPostById(id);
        if (post == null) return NotFound();
        if (post.CreatorName != username) return Forbid();
        unitOfWork.PostRepository.DeletePost(post);
        await unitOfWork.Complete();
        return NoContent();
    }
}
