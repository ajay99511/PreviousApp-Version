using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class MessageHub(IMessageRepository messageRepository, IUserRepository userRepository,
IMapper mapper, IHubContext<PresenceHub> presenceHub) :Hub
{
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var otherUser = httpContext?.Request.Query["user"];

        if (string.IsNullOrEmpty(otherUser) || Context.User == null) throw new Exception("Cant get usernames");
        var groupName = GetGroupName(Context.User.GetUsername(),otherUser);
        await Groups.AddToGroupAsync(Context.ConnectionId,groupName);
        var group = await AddToGroup(groupName);

        await Clients.Group(groupName).SendAsync("UpdatedGroup",group);

        var messages = await messageRepository.GetMessageThread(Context.User.GetUsername(),otherUser!);
        await Clients.Caller.SendAsync("Recieved Message Thread",messages);
        // return base.OnConnectedAsync();
    }
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var group = await RemoveFromMessageGroup();
        await Clients.Group(group.Name).SendAsync("UpdatedGroup",group);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(CreateMessageDto createMessageDto)
    {
        var username = Context.User?.GetUsername() ?? throw new Exception("Could not get user");

        if(username == createMessageDto.RecipientUsername.ToLower()) 
            throw new HubException("Cannot send message to yourself");
        var sender = await userRepository.GetUserByUsernameAsync(username);
        var recipient = await userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);
        if(recipient == null || sender == null || sender.UserName ==null || recipient.UserName == null) 
            throw new HubException("Sorry!! Can't forward the text");
        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            SenderUsername = username,
            RecipientUsername = createMessageDto.RecipientUsername,
            Content = createMessageDto.Content
        };
        var groupName = GetGroupName(sender.UserName,recipient.UserName);
        var group = await messageRepository.GetMessageGroup(groupName);

        if(group != null && group.Connections.Any(x=>x.Username == recipient.UserName))
        {
            message.DateRead = DateTime.UtcNow;
        }
        else
        {
            var connections = await PresenceTracker.GetConnectionsForUser(recipient.UserName);
            if(connections != null && connections?.Count != null)
            {
                await presenceHub.Clients.Clients(connections).SendAsync("NewMessageRecieved",
                new {username = sender.UserName, knownAs = sender.KnownAs});
            }
        }
        messageRepository.AddMessage(message);
        if(await messageRepository.SaveAllAsync()) 
        {
            // var group = GetGroupName(sender.UserName,recipient.UserName);
            await Clients.Group(groupName).SendAsync("New message",mapper.Map<MessageDto>(message));
        }
    }
    private async Task<Group> AddToGroup(string groupName)
    {
        var username = Context.User?.GetUsername() ?? throw new Exception("UserName cant get");
        var group = await messageRepository.GetMessageGroup(groupName);
        var connection = new Connection{ConnectionId = Context.ConnectionId, Username = username};

        if(group == null)
        {
            group = new Group{Name = groupName};
            messageRepository.AddGroup(group);
        }
        group.Connections.Add(connection);
        if(await messageRepository.SaveAllAsync()) return group;
        throw new HubException("Error in adding group");
    }
    private async Task<Group> RemoveFromMessageGroup()
    {
        var group = await messageRepository.GetGroupForConnection(Context.ConnectionId);
        var connection = group?.Connections.FirstOrDefault(x=> x.ConnectionId == Context.ConnectionId);
        if(connection != null && group != null)
        {
            messageRepository.RemoveConnection(connection);
            if(await messageRepository.SaveAllAsync()) return group;
        }
        throw new Exception("Failed to update the group");
    }
    private string GetGroupName(string caller , string? other)
    {
        var stringCompare = string.CompareOrdinal(caller, other)<0;
        return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
    }
}