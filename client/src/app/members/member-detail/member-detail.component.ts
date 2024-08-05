import { Component, inject, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { Member } from '../../_models/member';
import { MemberService } from '../../_services/member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { MessageService } from '../../_services/message.service';
import { Message } from '../../_models/message';
import { LikesService } from '../../_services/likes.service';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { merge } from 'rxjs';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  member:Member = {} as Member;
  private messageService = inject(MessageService);
  private accountService = inject(AccountService);
  presenceService = inject(PresenceService);
  // private memberService = inject(MemberService);
  private likeService = inject(LikesService);
  @ViewChild('memberTabs',{static: true}) memberTabs? : TabsetComponent;
  images : GalleryItem[] = [];
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  activeTab?:TabDirective;
  hasLiked : boolean = false;
  messages : Message[] = [];
  selectTab(heading: string)
  { 
    if(this.memberTabs)
    {
      const messageTabs = this.memberTabs.tabs.find(x=>x.heading === heading);
      if(messageTabs)
      {
        messageTabs.active = true;
      }
    }
  }
  // onMessageUpdated(event:Message)
  // {
  //   this.messages.push(event);
  // }
  onTabActivated(data : TabDirective)
  {
    this.activeTab = data;
    this.router.navigate([],{
      relativeTo: this.route,
      queryParams : {tab : this.activeTab.heading},
      queryParamsHandling : 'merge'
    }
    )
    if(this.activeTab.heading === 'Messages' && this.member)
    {
      const user = this.accountService.currentUser();
      if(!user) return;
      this.messageService.createHubConnection(user,this.member.userName);
    }
    else
    {
      this.messageService.stopHubConnection();
    }
  }
  onRouteParamsChange()
  {
    const user = this.accountService.currentUser();
    if(!user) return;
    if(this.messageService.hubConnection?.state === HubConnectionState.Connected && this.activeTab?.heading === 'Messages')
    {
      this.messageService.hubConnection.stop().then(()=>
      {
        this.messageService.createHubConnection(user,this.member.userName);
      })
    }
  }
  ngOnInit(): void {
    this.route.data.subscribe(
      {
        next:data =>
        {
          this.member = data['member'];
          this.member && this.member.photos.map(
            p=>{
              this.images.push(new ImageItem({src:p.url, thumb:p.url}))
            }
          )
        }
      }
    )

    this.route.paramMap.subscribe(
      {
        next: _ =>this.onRouteParamsChange()
      }
    )

    this.route.queryParams.subscribe(
      {
        next:params=>
        {
          params['tab'] && this.selectTab(params['tab'])
        }
      }
    )
  }
toggleLike()
{
  if(this.member)
  {
    this.likeService.toggleLike(this.member.id).subscribe(
      {
        next:()=>{
          this.hasLiked = this.likeService.isLiked(this.member.id)();
        }
      }
    )
  }
}
ngOnDestroy(): void {
  this.messageService.stopHubConnection();
}
  // loadMember() {
  //   const username = this.route.snapshot.paramMap.get('username');
  //   if(!username) return;
  //   this.memberService.getMember(username).subscribe(
  //     {
  //       next:member=>{
  //         this.member = member;
  //         member.photos.map(
  //           p=>{ this.images.push(new ImageItem({src:p.url,thumb:p.url}))}
  //         )
  //       }
  //     }
  //   )
  // }
  // this.messageService.getMessageThread(this.member.userName).subscribe(
  //   {
  //     next:messages =>this.messages = messages
  //   }
  // )
}
