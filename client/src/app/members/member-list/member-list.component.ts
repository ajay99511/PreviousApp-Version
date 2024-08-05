import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../../_services/member.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { NgxSpinnerComponent } from 'ngx-spinner';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../_services/account.service';
import { UserParams } from '../../_models/userParams';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent,NgxSpinnerComponent,PaginationModule,FormsModule,ButtonsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  // private accountService = inject(AccountService);
  // userParams = new UserParams(this.accountService.currentUser());
  memberService = inject(MemberService);
  genderList = [{value:'male',display :'male'},{value:'female',display:'female'},{value:'all',display:'all'}];
  ngOnInit(): void {
    if(!this.memberService.paginatedResult()) this.loadMembers();
  }
  loadMembers()
  {
    this.memberService.getMembers();
  }
  resetFilters()
  {
    this.memberService.resetUserParams();
    // this.userParams = new UserParams(this.accountService.currentUser());
    this.loadMembers();
  }
  pageChanged(event : any)
  {
    if(this.memberService.userParams().pageNumber !== event.page)
    {
      this.memberService.userParams().pageNumber = event.page;
      this.loadMembers();
    }
  }
}
