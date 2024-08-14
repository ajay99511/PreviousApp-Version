import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_models/user';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private modalService = inject(BsModalService);
  bsModalRef : BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
  users : User[] = [];
  getUserWithRoles()
  {
    this.adminService.getUsersWithRoles().subscribe(
      {
        next:users => this.users = users,
      }
    );
  }
  openRolesModal(user: User)
  {
    const initialState :ModalOptions = {
      class : 'modal-lg',
      initialState : {
        title : 'User roles',
        username : user.username,
        selectedRoles : [...user.roles],
        availableRoles : ['Admin','Moderator','Member'],
        users :this.users,
        rolesUpdated : false
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, initialState);
    this.bsModalRef.onHide?.subscribe(
      {
        next : () =>
        {
          if(this.bsModalRef.content && this.bsModalRef.content.rolesUpdated)
          {
            const selectedRoles = this.bsModalRef.content.selectedRoles;
            this.adminService.editUserRoles(user.username,selectedRoles).subscribe({
              next : roles => user.roles = roles
            })
          }
        }
      }
    )
  }
  ngOnInit(): void {
    this.getUserWithRoles();
  }
}
