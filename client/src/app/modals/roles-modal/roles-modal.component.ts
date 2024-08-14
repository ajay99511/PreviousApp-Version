import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-modal',
  standalone: true,
  imports: [],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.css'
})
export class RolesModalComponent {
bsModalRef = inject(BsModalRef);
username = '';
title = '';
rolesUpdated = false;
selectedRoles : string[] = [];
availableRoles : string[] = [];
updateChecked(checkedValue : string)
{
  if(this.selectedRoles.includes(checkedValue))
  {
    this.selectedRoles = this.selectedRoles.filter(x=>x!==checkedValue);
  }
  else{
    this.selectedRoles.push(checkedValue);
  }
}
onSelectRoles ()
{
  this.rolesUpdated = true;
  this.bsModalRef.hide();
}
}
