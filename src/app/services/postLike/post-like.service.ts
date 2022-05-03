import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PostLike} from "../../models/PostLike";

@Injectable({
  providedIn: 'root'
})
export class PostLikeService {
  private baseUrl = environment.ipAddress + environment.port + '/post/';

  constructor(private http: HttpClient) { }

  getLikesByPostId(postId: number): Observable<any> {
    return this.http.get(this.baseUrl + 'getLikesByPost/'+postId);

  }

  removeLikeFromPost(postId: number, userId: number) {
    return this.http.get(this.baseUrl + 'removeLikeFromPost/'+postId+"/"+userId);

  }

  addLikeToPost(postLike: PostLike): Observable<any> {

    return this.http.post(this.baseUrl + 'addLikeToPost', postLike);
  }
}
