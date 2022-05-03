import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router';
import { AuthService } from "src/app/services/authservice/auth.service";

@Component({
  selector: "app-profilepage",
  templateUrl: "profilepage.component.html"
})
export class ProfilepageComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
}
}
