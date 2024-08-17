using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class CreatePostDto
    {
        public required string Description { get; set; }
        public string PicUrl { get; set; } = "";
    }
}