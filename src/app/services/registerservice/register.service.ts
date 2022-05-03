import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import { User } from 'src/app/models/User';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private baseURL = "http://localhost:8085/api/auth";

  constructor(private _http:HttpClient) { }

  AddUser(user: User){
    return this._http.post<User>(`${this.baseURL}/${"signup"}`,user);

  }


}
