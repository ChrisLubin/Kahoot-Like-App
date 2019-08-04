import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_ROOT } from '../models/config';
import { Question } from '../models/question.interface';

@Injectable({
  providedIn: 'root'
})

export class GameService {
  readonly SERVER_ROOT: string = SERVER_ROOT;
  private gamePin: string;
  private username: string;
  private gameQuestions: Question[];

  constructor(private http: HttpClient) { }

  public findGame(pin: string):Observable<any> {
    return this.http.get<any>(`${this.SERVER_ROOT}/join/${pin}`, {observe: 'response'});
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

  public getGameQuestions(): Question[] {
    return this.gameQuestions;
  }

  public setGameQuestions(questions: Question[]): void {
    this.gameQuestions = questions;
    return;
  }
}
