using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public class PresenceHub(PresenceTracker tracker) : Hub
{
    public async override Task OnConnectedAsync()
    {
        if(Context.User == null)   throw new HubException("Cannot Get current user claim");
        var isOnline = await tracker.UserConnected(Context.User.GetUsername(),Context.ConnectionId);
        if(isOnline) await Clients.Others.SendAsync("User is Online",Context.User?.GetUsername());

        var currentUsers = await tracker.GetUsersOnline();
        await Clients.Caller.SendAsync("GetOnlineUsers",currentUsers);
    }
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if(Context.User == null)   throw new HubException("Cannot Get current user claim");
        var isOffline = await tracker.UserDisconnected(Context.User.GetUsername(),Context.ConnectionId);

        if(isOffline) await Clients.Others.SendAsync("User is offline",Context.User?.GetUsername());
        await base.OnDisconnectedAsync(exception);
    }
}
