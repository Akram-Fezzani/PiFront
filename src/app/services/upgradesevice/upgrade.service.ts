import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contributor } from '../../models/Contributor';

@Injectable({
  providedIn: 'root'
})
export class UpgradeService {


  private baseURL = "http://localhost:8085/contributor";

  constructor(private _http:HttpClient) { }

  AddContributor(contributor: Contributor){
    return this._http.post<Contributor>(`${this.baseURL}/${"post"}`,contributor);

  }


}
