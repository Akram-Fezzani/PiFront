import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResetService } from 'src/app/services/resetservice/reset.service';
import { TokenStorageService } from 'src/app/services/tokenstorageservice/token-storage.service';
import { Reset } from '../../models/reset';


@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  form: any={};


  constructor(private resetservice:ResetService, private router: Router,private ts:TokenStorageService) { }

reset(){
  const id=this.ts.getId()+"";
  console.log(id);
    this.resetservice.reset(id,this.form.password).subscribe((r:any)=>{
      console.log(r);
    },(error:any) => console.log(error));
}
  ngOnInit(): void {
  }

}
