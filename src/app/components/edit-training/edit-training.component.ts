import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Training } from '../../models/Training';
import { TrainingsService } from '../../services/trainings/trainings.service';

@Component({
  selector: 'app-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.scss']
})
export class EditTrainingComponent implements OnInit {
  ListTrainings!:Training[];
  constructor(private _serviceProd:TrainingsService,private router: Router) {
  }
  getAll(){
    this._serviceProd.getAll().subscribe((resultat)=>{
        console.log(resultat);

        this.ListTrainings=resultat;

      },
      (error)=>{
        console.log(error.status)
      }
    );
  }
  ngOnInit(): void {
    this.getAll();
  }

  deleteTraining(id: number){
    this._serviceProd.deleteTrainingById(id).subscribe( data => {
      console.log(data);
      this.getAll();
    })
  }
  updateTraining(id: number){
    this.router.navigate(['updateTraining', id]);
  }

}
