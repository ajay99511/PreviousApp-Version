import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Message } from '../_models/message';
import { PaginatedResult } from '../_models/pagination';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../_models/user';
import { group } from '@angular/animations';
import { Group } from '../_models/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
baseUrl = environment.apiUrl;
hubUrl = environment.hubsUrl;
hubConnection? : HubConnection;
private http = inject(HttpClient);
paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
messageThread=signal<Message[]>([]);

createHubConnection(user : User, otherUsername :string)
{
  this.hubConnection = new HubConnectionBuilder()
  .withUrl(this.hubUrl+'message?user='+otherUsername,{
    accessTokenFactory : () =>user.token
  })
  .withAutomaticReconnect()
  .build();

  this.hubConnection.start().catch(err=>console.log(err));

  this.hubConnection.on('Recieved Message Thread',messages=>{
    this.messageThread.set(messages);
  });
  this.hubConnection.on('New message', message =>
  {
    this.messageThread.update(messages=>[...messages,message])
  });

  this.hubConnection.on('UpdatedGroup',(group: Group)=>{
    if(group.connections.some(x=>x.username === otherUsername))
    {
      this.messageThread.update(messages=>
      {
        messages.forEach(message=>
          {
            if(!message.dateRead){
              message.dateRead =new Date(Date.now());
  
            }
          }
        )
        return messages;
      }
    )
  }
}
  )
}

stopHubConnection()
{
  if(this.hubConnection?.state !== HubConnectionState.Connected)
  {
    this.hubConnection?.stop().catch(err=>console.log(err));
  }
}

getMessages(pageNumber:number, pageSize : number,container:string)
{
  let params = setPaginationHeaders(pageNumber,pageSize);
  params = params.append('container',container);
  return this.http.get<Message[]>(this.baseUrl+'message',{observe:'response',params}).subscribe(
    {
      next : response =>setPaginatedResponse(response,this.paginatedResult)
    }
  );
}
deleteMessage(id:number)
{
  return this.http.delete(this.baseUrl+'message/'+id);
}
getMessageThread(username:string)
{
return this.http.get<Message[]>(this.baseUrl+'message/thread/'+username);
}
async sendMessage(username:string,content:string)
{
  // return this.http.post<Message>(this.baseUrl+'message',{recipientUsername : username,content});
  return this.hubConnection?.invoke('SendMessage' ,{recipientUsername : username,content});
}
}
