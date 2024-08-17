using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class PostDto
    {
        public int Id { get; set; }
        public required string CreatorName { get; set; }
        public required string CreatorphotoUrl { get; set; }
        public string Description { get; set; } = "";
        public string? UploadPicUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}