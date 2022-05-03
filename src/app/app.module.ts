import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PostComponent } from './components/post/post.component';
import { ProgressComponent } from './components/progress/progress.component';
import { AddTrainingComponent } from './components/add-training/add-training.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TrainingsComponent } from './components/trainings/trainings.component';
import { UpdateTrainingComponent } from './components/update-training/update-training.component';
import { DndDirective } from './directives/dnd.directive';
import {EditTrainingComponent} from "./components/edit-training/edit-training.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { HttpClientModule } from '@angular/common/http';
import {ToastrModule} from "ngx-toastr";
import { AddPostComponent } from './components/add-post/add-post.component';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {NgPipesModule} from "ngx-pipes";
import {DeleteDialogComponent} from "./delete-dialog/delete-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {A11yModule} from "@angular/cdk/a11y";
import { SinglePostComponent } from './components/single-post/single-post.component';
import { HomeComponent } from './components/home/home.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Ng2SearchPipeModule} from "ng2-search-filter";
import { CreateAdComponent } from './components/create-ad/create-ad.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { LoginComponent } from './components/login/login.component';
import { ProfilepageComponent } from './components/profilepage/profilepage.component';
import { RegisterpageComponent } from './components/registerpage/registerpage.component';
import { ResetComponent } from './components/reset/reset.component';
import { UpdateprofileComponent } from './components/updateprofile/updateprofile.component';
import { UpgradeComponent } from './components/upgrade/upgrade.component';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    ProgressComponent,
    AddTrainingComponent,
    FooterComponent,
    NavbarComponent,
    TrainingsComponent,
    UpdateTrainingComponent,
    DndDirective,
    EditTrainingComponent,
    AddPostComponent,
    DeleteDialogComponent,
    SinglePostComponent,
    HomeComponent,
    ChatbotComponent,
    SidebarComponent,
    CreateAdComponent,
    ChangepasswordComponent,
    LoginComponent,
    ProfilepageComponent,
    RegisterpageComponent,
    ResetComponent,
    UpdateprofileComponent,
    UpgradeComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CollapseModule,
        BsDatepickerModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        MatButtonModule,
        MatCardModule,
        MatMenuModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        NgbModule,
        TooltipModule,
        BsDropdownModule,
        NgPipesModule,
        MatDialogModule,
        A11yModule,
        MatProgressSpinnerModule,
        Ng2SearchPipeModule

    ],
  providers: [],
  exports: [
    PostComponent,
    NavbarComponent,
    TrainingsComponent,
    AddTrainingComponent,
    FooterComponent,
    UpdateTrainingComponent,
    EditTrainingComponent,
    ChangepasswordComponent,
    LoginComponent,
    ProfilepageComponent,
    RegisterpageComponent,
    ResetComponent,
    UpdateprofileComponent,
    UpgradeComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
