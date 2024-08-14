import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { tick } from '@angular/core/testing';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubsUrl;
  private hubConnection? :HubConnection;
  private toastr = inject(ToastrService);
  private router = inject(Router)
  onlineUsers = signal<string[]>([]);
  createHubConnection(user : User)
  {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl+'presence',{
      accessTokenFactory:()=>user.token
    })
    .withAutomaticReconnect()
    .build();
    this.hubConnection.start().catch(error=>console.log(error));

    this.hubConnection.on('User is Online',username=>{
      this.onlineUsers.update(users=>[...users,username]);
      // this.toastr.info(username+' has connected!')
    });

    this.hubConnection.on('User is offline',username=>{
      // this.toastr.warning(username+' has disconnected')
      this.onlineUsers.update(users=>users.filter(x=>x !== username));
    });

    this.hubConnection.on('GetOnlineUsers',usernames =>
    {
      this.onlineUsers.set(usernames)
    }
    );

    this.hubConnection.on('NewMessageRecieved',({username,knownAs}) =>
    {
      this.toastr.info(knownAs+' has send you a message! Click it to open!')
      .onTap
      .pipe(take(1))
      .subscribe(()=>this.router.navigateByUrl('members/'+username+ '?tab=Messages'))
    }
  );
  }
  stopHubConnection()
  {
    if(this.hubConnection?.state === HubConnectionState.Connected)
    {
      this.hubConnection.stop().catch(error=>console.log(error))
    }
  }

  constructor() { }
}
