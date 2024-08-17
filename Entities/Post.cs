using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Post
    {
        public int Id { get; set;}
        public required string CreatorName { get; set; }
        public string Description{ get; set; } = "";
        public string PhotoUrl{ get; set; } = "";
        public DateTime CreatedAt{ get; set;} = DateTime.UtcNow;

        //Navigation Properties
        public int CreatorId { get; set; }
        public AppUser Creator { get; set; } = null!;

    }
}