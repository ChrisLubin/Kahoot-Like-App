import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_ROOT } from '../models/config';
import { Game } from '../models/game.interface';
import { Question } from '../models/question.interface';

@Injectable({
  providedIn: 'root'
})

export class GameService {
  readonly SERVER_ROOT: string = SERVER_ROOT;
  private gamePin: string;
  private username: string;
  private game: Game;

  constructor(private http: HttpClient) { }

  public findGame(pin: string):Observable<any> {
    return this.http.get<any>(`${this.SERVER_ROOT}/join/${pin}`, {observe: 'response'});
  }

  public didGameStart(pin: string):Promise<any> {
    return this.http.get<any>(`${this.SERVER_ROOT}/didGameStart/${pin}`).toPromise();
  }

  public getGamePin():string {
    return this.gamePin;
  }

  public setGamePin(pin:string): void {
    this.gamePin = pin;
    return;
  }

  public getMyUsername():string {
    return this.username;
  }

  public setMyUsername(username:string): void {
    this.username = username;
    return;
  }

  public getUsers(pin: string):Promise<any> {
    return this.http.get<any>(`${this.SERVER_ROOT}/getUsers/${pin}`).toPromise();
  }

  public createGame(gameData: Question[]):Promise<any> {
    return this.http.post<any>(`${this.SERVER_ROOT}/create`, gameData).toPromise();
  }

  public getGame(): Game {
    return this.game;
  }

  public setGame(game: Game): void {
    this.game = game;
    return;
  }
}
