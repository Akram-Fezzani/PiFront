import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { User } from 'src/app/models/User';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.scss']
})
export class UpdateprofileComponent implements OnInit {
  user!: User;
  constructor(private ps: ProfileService ) { }

  ngOnInit(): void {
    this.user=AppComponent.instance.getCurrentUser();
    console.log(this.user);
  }
update(user: User){
this.ps.update(user);


}



}
