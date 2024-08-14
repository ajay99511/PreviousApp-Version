import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../_models/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../_services/likes.service';
import { PresenceService } from '../../_services/presence.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  member = input.required<Member>();
  likesService = inject(LikesService);
  presenceService = inject(PresenceService);
  //hasLiked : boolean = false;
  hasLiked = computed(()=>this.likesService.likeIds().includes(this.member().id));
  isOnline = computed(()=>this.presenceService.onlineUsers().includes(this.member().userName));
  toggleLike()
  {
    if(this.member())
    {
      this.likesService.toggleLike(this.member().id).subscribe(
        {
          next:()=>{
            this.hasLiked = this.likesService.isLiked(this.member().id);
          }
        }
      );
    }
    //.subscribe(
    //   {
    //     next:()=>
    //     {
    //       if(this.hasLiked())
    //       {
    //         this.likesService.likeIds.update(ids=>ids.filter(x=>x !== this.member().id))
    //       }
    //       else
    //       {
    //         this.likesService.likeIds.update(ids=>[...ids,this.member().id])
    //       }
    //     }
    //   }
    // )
  }
}
