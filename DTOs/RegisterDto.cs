using System.ComponentModel.DataAnnotations;

namespace API.DTOs;
public class RegisterDto{
    [Required]
    public required string username{get;set;} 
    [Required]
    public required string password{get;set;}
}