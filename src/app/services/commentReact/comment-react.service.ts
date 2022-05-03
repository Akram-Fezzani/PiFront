import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CommentReact} from "../../models/CommentReact";

@Injectable({
  providedIn: 'root'
})
export class CommentReactService {
  private baseUrl = environment.ipAddress + environment.port + '/comment/';
  constructor(private http: HttpClient) { }

  findReactByCommentId(commentId: number): Observable<any> {
    return this.http.get(this.baseUrl + 'findReactByCommentId/'+commentId);
  }

  updateReact(commentReact: CommentReact) {
    return this.http.post(this.baseUrl + 'addReactToComment/',commentReact);

  }

  removeReaction(commentId: number, userId: number) {
    return this.http.get(this.baseUrl + 'removeReactFromComment/'+commentId+"/"+userId);

  }
}
