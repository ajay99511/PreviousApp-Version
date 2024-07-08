namespace API.Entities;
public class AppUser
{
    public int Id{ get; set; }
    public required string UserName{ get; set; }
    public required byte[] passwordHash{ get; set; }
    public required byte[] passwordSalt{ get; set; }
}