import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (Component) => {
  if(Component.editForm?.dirty)
  {
    return confirm("Are you sure the changes will lost!!");
  }
  return true;
};
