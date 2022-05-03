import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private baseUrl = environment.ipAddress + environment.port + '/chatbot/';
  constructor(private http: HttpClient) { }

  search(message: string) {
    return this.http.get(this.baseUrl + 'search/'+message, {responseType:"text"});
  }

}
