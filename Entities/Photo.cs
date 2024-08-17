using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Photos")]
public class Photo
{
    public int Id { get; set;}
    public required string Url { get; set;}
    public bool IsMain { get; set;}
    // public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? PublicId{ get; set; } 
    
    //Navigation Properties
    public int AppUserId{ get; set;}
    public AppUser AppUser{ get; set;} = null!;
}