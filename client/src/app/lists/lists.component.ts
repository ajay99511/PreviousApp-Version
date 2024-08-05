import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LikesService } from '../_services/likes.service';
import { Member } from '../_models/member';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [ButtonsModule, FormsModule, MemberCardComponent,PaginationModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit, OnDestroy{
  pageNumber=1;
  pageSize = 5;
  ngOnInit(): void {
    this.LoadLikes();
  }
  likesService = inject(LikesService);
  member : Member[] = [];
  predicate = "liked";
  getTitle()
  {
    switch(this.predicate)
    {
      case "liked" : return "Members you like";
      case "likedBy" : return "Members who liked you";
      default: return "Mutually Liked";
    }
  }
  LoadLikes()
  {
    this.likesService.getLikes(this.predicate,this.pageNumber,this.pageSize);
  }
  pageChanged(event : any)
  {
    if(this.pageNumber != event.page)
    {
      this.pageNumber = event.page;
      this.LoadLikes();
    }
  }
  ngOnDestroy(): void {
    this.likesService.paginatedResult.set(null);
  }
}
