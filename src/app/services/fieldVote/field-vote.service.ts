import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {Post} from "../../models/Post";
import {Observable} from "rxjs";
import {FieldVote} from "../../models/FieldVote";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FieldVoteService {
  private baseUrl = environment.ipAddress + environment.port + '/post/';

  constructor(private http: HttpClient) { }

  updateVotePoll(vote: FieldVote): Observable<any> {
    return this.http.post(this.baseUrl + 'votePoll', vote);
  }
  removeVotePoll(userId: number, fieldId:number): Observable<any> {
    return this.http.get(this.baseUrl + 'removeVote/'+userId+"/"+fieldId);
  }

  findAllVoteByField(pollFieldId: number): Observable<any>{
      return this.http.get(this.baseUrl + 'findAllVoteByField/'+pollFieldId);

  }
}
