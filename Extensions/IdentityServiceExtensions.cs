using System.Text;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;
public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services,IConfiguration config)
    {
        services.AddIdentityCore<AppUser>(opt=>
        {
            opt.Password.RequireNonAlphanumeric = false;
            opt.Password.RequiredLength = 8;
        })
        .AddRoles<AppRole>()
        .AddRoleManager<RoleManager<AppRole>>()
        .AddEntityFrameworkStores<DataContext>();
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(Options=>
        {
            var tokenKey = config["TokenKey"] ?? throw new Exception("Token Key Not Found");
        Options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey=true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
            ValidateIssuer=false,
            ValidateAudience=false
        };
        });
        services.AddAuthorizationBuilder()
        .AddPolicy("RequireAdminRole",policy=>policy.RequireRole("Admin"))
        .AddPolicy("ModeratePhotoRole",policy=>policy.RequireRole("Admin","Moderator"));
        return services;
    }
}