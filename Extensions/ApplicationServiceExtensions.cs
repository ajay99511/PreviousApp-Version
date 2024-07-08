using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;
public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,IConfiguration config)
    {
        services.AddControllers();
        services.AddCors();
        services.AddScoped<ITokenService,TokenService>();
        services.AddDbContext<DataContext>(opt=>
        {
            opt.UseSqlite(config.GetConnectionString("Default Connection"));
        });
        return services;
    }

}
