import { Component, OnInit } from '@angular/core';
import { AuthLoginInfo } from '../../models/login-info';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/authservice/auth.service';
import { TokenStorageService } from 'src/app/services/tokenstorageservice/token-storage.service';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/models/User';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: any={};
  currentUser!: User;
  isLoginFailed =false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router,private ts:TokenStorageService) { }

login(){
  console.log(this.form.username, this.form.password);
    this.authService.login(new AuthLoginInfo(this.form.username, this.form.password))
    .subscribe(
      
(data:any) =>{
  this.isLoginFailed = false;
  const id=this.ts.getId()+"";
this.authService.getcurrentuser(id).subscribe((data:any) =>{
AppComponent.instance.currentUser = data;
this.currentUser = data;
console.log(this.currentUser);
},
(error:any) => {
  this.isLoginFailed = true;
}
    )

},
(error:any) => {
  this.isLoginFailed = true;
}
    )
    this.router.navigate(['/profile']);

}


getcurrentuser(){
const id=this.ts.getId()+"";
this.authService.getcurrentuser(id);
this.authService.getcurrentuser(id,).subscribe((r:any)=>{
  console.log(r);
},(error:any) => console.log(error));

}
  
  ngOnInit(): void {
  }

 

}
