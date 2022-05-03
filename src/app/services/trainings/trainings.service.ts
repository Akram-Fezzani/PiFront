import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Training } from '../../models/Training';

@Injectable({
  providedIn: 'root'
})
export class TrainingsService {
  trainingsUrl="http://localhost:8085/trainings/getTraining";
  private baseURL = "http://localhost:8085/trainings";

  constructor(private _http:HttpClient) { }

  getAll():Observable<Training[]>{
    return this._http.get<Training[]>(`${this.baseURL}/${"getTraining"}`);
  }
  AddTraining(training: Training){
    return this._http.post<Training>(`${this.baseURL}/${"add-training"}`,training);

  }
  deleteTrainingById(id:number){
    return this._http.delete(`${this.baseURL}/${"delete-training"}/${id}`);
  }
  updateTraining(training: Training, id:number): Observable<Object>{
    return this._http.put(`${this.baseURL}/${"update-training"}/${id}`,training);
  }
  getTrainingById(id: number): Observable<Training>{
    return this._http.get<Training>(`${this.baseURL}/${"getTrainingById"}/${id}`);
  }


}
