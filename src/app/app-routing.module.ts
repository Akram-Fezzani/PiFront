import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {PostComponent} from "./components/post/post.component";
import {TrainingsComponent} from "./components/trainings/trainings.component";
import {UpdateTrainingComponent} from "./components/update-training/update-training.component";
import {HomeComponent} from "./components/home/home.component";
import { ProfilepageComponent } from './components/profilepage/profilepage.component';
import { RegisterpageComponent } from './components/registerpage/registerpage.component';
import { LoginComponent } from './components/login/login.component';
import { UpgradeComponent } from './components/upgrade/upgrade.component';
import { UpdateprofileComponent } from './components/updateprofile/updateprofile.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { ResetComponent } from './components/reset/reset.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'trainings', component: TrainingsComponent },
  { path: 'updateTraining', component: UpdateTrainingComponent },
  { path: "profile", component: ProfilepageComponent },
  
  { path: "register", component: RegisterpageComponent },
  { path: "login", component: LoginComponent },
  { path: "upgrade", component: UpgradeComponent },
  { path: "updateprofile", component: UpdateprofileComponent },
  { path: "Changepassword", component: ChangepasswordComponent },
  { path: "reset", component: ResetComponent }
  // { path: 'landing', component: LandingpageComponent },
  // { path: 'trainings', component: TrainingsComponent },
  // { path: 'addTraining', component: AddTrainingComponent },
  // { path: 'editTrainings', component: EditTrainingsComponent },
  // { path: 'updateTraining/:id', component: UpdateTrainingComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
