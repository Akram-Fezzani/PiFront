import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Post} from '../../models/Post';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = environment.ipAddress + environment.port + '/post/';

  constructor(private http: HttpClient) { }
  add(post: Post): Observable<any> {
    return this.http.post(this.baseUrl + 'addPost', post);
  }

  uploadImage(uploadImageData: FormData, postId: any){
    return this.http.post(this.baseUrl + 'uploadPostFile/'+postId, uploadImageData, {responseType:"text"});
  }
  loadImage(fileName:any) {
    return this.http.get(this.baseUrl + 'getPostFile/' + fileName, {responseType:"text"});

  }

  list(filterType: string, userId: number, offset:number, numOfPostsToFetch:number): Observable<any> {
    return this.http.get(this.baseUrl + 'getFilteredPosts/'+filterType+'/'+userId+'/'+offset+'/'+numOfPostsToFetch);
  }

  getPostById(postId: number): Observable<any> {
    return this.http.get(this.baseUrl+'findPostById/'+postId);
  }

  serchPosts(value: string): Observable<any>{
    return this.http.get(this.baseUrl+'searchPosts/'+value);
  }

  countPosts(): Observable<any> {
    return this.http.get(this.baseUrl+'countPosts');
  }

  getPollByPostId(postId: number):Observable<any> {

    return this.http.get(this.baseUrl+'getPollByPostId/'+postId);
  }

  deletePost(postId: number) : Observable<any>{
    return this.http.delete(this.baseUrl+'deletePost/'+postId);
  }

  deleteImage(fileName: string, postId: number) {
    return this.http.delete(this.baseUrl+'deletePostFile/'+postId+"/"+fileName);

  }

  update(post: Post, id:number): Observable<any> {

    return this.http.post(this.baseUrl + 'updatePost/'+id, post);
  }
}
