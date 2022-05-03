import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Comment} from "../../models/Comment";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = environment.ipAddress + environment.port + '/comment/';
  constructor(private http: HttpClient) { }

  getAllByPostId(commentsFilterType: string, postId: number): Observable<any>  {
    return this.http.get(this.baseUrl + 'getFilteredComments/'+commentsFilterType+'/'+postId);
  }

  addCommnet(com: Comment): Observable<any> {
    return this.http.post(this.baseUrl + 'addComment',com);

  }
}
