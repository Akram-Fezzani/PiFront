import { Component, OnInit } from '@angular/core';
import { Training } from '../../models/Training';
import { Router } from '@angular/router';
import { TrainingsService } from '../../services/trainings/trainings.service';

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss']
})
export class AddTrainingComponent implements OnInit {
  training: Training=new Training();
  constructor(private us:TrainingsService, private _router:Router) { }
  addTrainings(){
    this.us.AddTraining(this.training).subscribe( data =>{
        console.log(data);

      },
      error => console.log(error));  }
  ngOnInit(): void {
  }
  goToTrainingsList(){
    this._router.navigate(['/trainings']);
  }
  onSubmit(){
    console.log(this.training,"training heeeeeeeeeeere");
    this.goToTrainingsList();
    this.addTrainings();
  }
}
