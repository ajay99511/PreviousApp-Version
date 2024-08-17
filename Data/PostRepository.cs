using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class PostRepository(DataContext context, IMapper mapper) : IPostRepository
    {
        public void AddPost(Post post)
        {
           context.Posts.Add(post);
        }

        public void DeletePost(Post post)
        {
            context.Posts.Remove(post);
        }

        public Task<Post> EditUserPost(string username)
        {
            throw new NotImplementedException();
        }

        public async Task<Post> GetPostById(int id)
        {
            var post = await context.Posts
            .FindAsync(id);
            if (post == null) throw new Exception("Post not available");
            return post;
        }

        public Task<Post> GetPostsForUser(string currentUsername)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<PostDto>> GetUserPost(string username)
        {
            var posts = await context.Posts
            .Where(x=>x.CreatorName == username)
            .ProjectTo<PostDto>(mapper.ConfigurationProvider)
            .ToListAsync();
            return posts;
        }

        // public async Task<bool> Savechanges()
        // {
        //     return await context.SaveChangesAsync()>0;
        // }

        // Task<PostDto> IPostRepository.GetUserPost(string username)
        // {
        //     throw new NotImplementedException();
        // }
    }
}