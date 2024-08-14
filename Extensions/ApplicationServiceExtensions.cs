using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using API.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;
public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,IConfiguration config)
    {
        services.AddControllers();
        services.AddCors();
        services.AddScoped<ITokenService,TokenService>();
        services.AddScoped<IUserRepository,UserRepository>();
        services.AddScoped<IPhotoService,PhotoService>();
        services.AddScoped<LogUserActivity>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.AddScoped<ILikeRepository,LikeRepository>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
        services.AddSingleton<PresenceTracker>();
        services.AddSignalR();
        services.AddDbContext<DataContext>(opt=>
        {
            opt.UseSqlite(config.GetConnectionString("Default Connection"));
        });
        return services;
    }

}
