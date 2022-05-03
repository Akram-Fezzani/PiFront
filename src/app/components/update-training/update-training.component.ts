import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Training } from '../../models/Training';
import { TrainingsService } from '../../services/trainings/trainings.service';

@Component({
  selector: 'app-update-training',
  templateUrl: './update-training.component.html',
  styleUrls: ['./update-training.component.scss']
})
export class UpdateTrainingComponent implements OnInit {
  id: number;
  training: Training = new Training();
  constructor(private ts: TrainingsService,
              private route: ActivatedRoute,
              private router: Router) {
    this.id = this.route.snapshot.params['id'];}

  ngOnInit(): void {

    this.ts.getTrainingById(this.id).subscribe(data => {
      this.training = data;
    }, error => console.log(error));
  }
  onSubmit(){
    this.ts.updateTraining(this.training,this.id).subscribe( data =>{
        this.goToTrainingList();
      }
      , error => console.log(error));
  }
  goToTrainingList(){
    this.router.navigate(['/editTrainings']);
  }
}
