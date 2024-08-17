using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IPostRepository
    {
        void AddPost (Post post);
        void DeletePost(Post post);
        Task<IEnumerable<PostDto>> GetUserPost(string username);
        Task<Post> GetPostsForUser (string currentUsername);
        Task<Post> GetPostById (int id);
        Task<Post> EditUserPost(string username);
        // Task<bool> Savechanges();
    }
}