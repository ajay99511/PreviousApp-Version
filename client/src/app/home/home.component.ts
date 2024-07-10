import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  registerMode=false;
  Users:any={}
  http = inject(HttpClient);
  ngOnInit(): void {
    this.getUsers();
  }
  getUsers()
  {
    this.http.get("http://localhost:5000/api/Users").subscribe(
      {
        next : Response=>this.Users=Response,
        error : Error=>console.log(Error),
        complete : ()=>console.log('Request Has Completed')
      }
    )
  }
  cancelRegisterMode(event:boolean){
    this.registerMode = event;
  }
  registerToggle(){
    this.registerMode=!this.registerMode;
  }
}
