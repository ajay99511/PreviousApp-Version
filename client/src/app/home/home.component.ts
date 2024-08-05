import { Component, inject} from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  private accountService = inject(AccountService);
  user = this.accountService.currentUser();
  registerMode=false;
  cancelRegisterMode(event:boolean){
    this.registerMode = event;
  }
  registerToggle(){
    this.registerMode=!this.registerMode;
  }
}
