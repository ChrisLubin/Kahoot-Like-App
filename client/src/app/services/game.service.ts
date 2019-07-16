import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GameService {
  readonly SERVER_ROOT: string = "http://127.0.0.1:8080"; // Your backend server root url here

  constructor(private http: HttpClient) { }

  public joinGame(pin: string):Observable<any> {
    return this.http.get<any>(`${this.SERVER_ROOT}/join/${pin}`, {observe: 'response'});
  }
}
