import { Component, HostListener, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { Member } from '../../_models/member';
import { MemberService } from '../../_services/member.service';
import { AccountService } from '../../_services/account.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, FormsModule, PhotoEditorComponent,TimeagoModule,DatePipe],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit{
  @ViewChild('editForm') editForm? :NgForm;
  @HostListener('window:BeforeUnloadEvent',['$event']) notify($event:any){
    if(this.editForm?.dirty)
    {
      $event.returnValue =true;
    }
  }
  member?:Member;
  private toastr = inject(ToastrService);
  private memberService = inject(MemberService);
  private accountService = inject(AccountService);
  ngOnInit(): void {
    this.loadMember();
  }
  loadMember()
  {
    const user = this.accountService.currentUser();
    if(!user) return;
    this.memberService.getMember(user.username).subscribe(
      {next:member=>this.member=member
      }
    )
  }
  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe(
      {
        next: _ =>{
          this.toastr.success("Saved Success");
          this.editForm?.reset(this.member);
        }
      }
    )
  }
  onMemberChange(event: Member)
  {
    this.member = event;
  }
}
