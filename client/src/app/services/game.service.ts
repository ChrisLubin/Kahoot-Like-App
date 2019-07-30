import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_ROOT } from '../models/config';

@Injectable({
  providedIn: 'root'
})

export class GameService {
  readonly SERVER_ROOT: string = SERVER_ROOT;
  private gamePin: string;
  private username: string;

  constructor(private http: HttpClient) { }

  public findGame(pin: string):Observable<any> {
    return this.http.get<any>(`${this.SERVER_ROOT}/join/${pin}`, {observe: 'response'});
  }

  public getGamePin():string {
    return this.gamePin;
  }

  public setGamePin(pin:string) {
    this.gamePin = pin;
  }

  public getMyUsername():string {
    return this.username;
  }

  public setMyUsername(username:string) {
    this.username = username;
  }

  public getUsers():Promise<any> {
    return this.http.get<any>(`${this.SERVER_ROOT}/getUsers`).toPromise();
  }
}
