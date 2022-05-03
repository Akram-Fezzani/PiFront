import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.ipAddress + environment.port + '/user/';

  constructor(private http: HttpClient) { }


  getUserById(userId:number): Observable<any> {
    return this.http.get(this.baseUrl + 'getUserById/'+userId);
  }
}
