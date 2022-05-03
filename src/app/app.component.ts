import {
  Component,
  OnInit,
  Renderer2,
  HostListener,
  Inject
} from '@angular/core';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import {User} from "./models/User";
import {UserService} from "./services/user/user.service";
import { TokenStorageService } from './services/tokenstorageservice/token-storage.service';
import { AuthService } from './services/authservice/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public static instance: AppComponent;
  currentUser!: User;
  gettingUser: boolean = true;
  constructor(
    private authService: AuthService,
    private ts:TokenStorageService,
    private userService:UserService,
    private renderer: Renderer2,
    public location: Location,
    @Inject(DOCUMENT) document: any
  ) {
    AppComponent.instance = this;
  }
  getCurrentUser() {
    return this.currentUser;
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e:any) {
    let element;
    if (window.pageYOffset > 100) {
      element = document.getElementById('navbar-top');
      if (element) {
        element.classList.remove('navbar-transparent');
        element.classList.add('bg-danger');
      }
    } else {
      element = document.getElementById('navbar-top');
      if (element) {
        element.classList.add('navbar-transparent');
        element.classList.remove('bg-danger');
      }
    }
  }
  ngOnInit() {
    this.gettingUser = true;
    const id=this.ts.getId()+"";
    if(id== "") {
      this.gettingUser = false;
    } else {
    this.authService.getcurrentuser(id).subscribe((data:any) =>{
    this.currentUser = data;
    console.log(this.currentUser);
    this.gettingUser = false;
    },
    (error:any) => {
      this.gettingUser = false;
    })
    
  }
    this.onWindowScroll(event);
  }
}
