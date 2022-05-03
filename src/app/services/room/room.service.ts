import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Post} from "../../models/Post";
import {Observable} from "rxjs";
import {Room} from "../../models/Room";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private baseUrl = environment.ipAddress + environment.port + '/chatRoom/';
  constructor(private http: HttpClient) { }

  add(topic: string, userId:number): Observable<any> {
    return this.http.get(this.baseUrl + 'createChatRoom/'+topic+"/"+userId);
  }

  getChatrooms(): Observable<any> {
    return this.http.get(this.baseUrl + 'getChatRooms');
  }


  getChatRoomById(roomId:number): Observable<any> {
    return this.http.get(this.baseUrl + 'getChatRoom/'+roomId);
  }

  // destroyRoom(roomId: number) {
  //   return this.http.get(this.baseUrl + 'destroyRoom/'+roomId);
  // }
}
