import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthLoginInfo } from '../../models/login-info';
import { JwtResponse } from '../../models/jwt-response';
import { Router } from '@angular/router';
import { TokenStorageService } from '../tokenstorageservice/token-storage.service';
import { User } from 'src/app/models/User';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

TOKEN_KEY = 'AuthToken';


private roles:string = "";
private currentUserSubject : BehaviorSubject<any>;
public currentUser :Observable<any>;
private loginUrl = 'http://localhost:8085/api/auth/signin'
;

constructor(private http: HttpClient ,  private tokenStorage: TokenStorageService,private router:Router){
  this.currentUserSubject = new BehaviorSubject<any>(sessionStorage.getItem(this.TOKEN_KEY));
  this.currentUser=this.currentUserSubject.asObservable();
}

public get currentUserValue():any{
  return this.currentUserSubject.value;
}


  login(LoginInfo :AuthLoginInfo){
    return this.http.post<JwtResponse>(this.loginUrl, LoginInfo)
    .pipe(map((data:any) => {
this.saveUserData(data);
return data;
    }))
  }

  private saveUserData(data:any){

    this.tokenStorage.saveToken(data.accessToken);
    this.tokenStorage.saveId(data.id);
    this.tokenStorage.saveUsername(data.username);
    this.tokenStorage.saveAuthorities(data.authorities);
  }






  public clear() {
    localStorage.clear();
  }

  public getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }
  public getRoles(): any {
    this.roles = localStorage.getItem('roles')+"";
    return JSON.parse(this.roles);
  }
  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }

    logout() {
      
      this.tokenStorage.saveToken("");
      this.tokenStorage.saveUsername("");
      this.tokenStorage.saveAuthorities("");
}

getcurrentuser(id: String):Observable<any>{
  
    return this.http.get( 'http://localhost:8085/user/getuserbyid/'+id);

  }


}

