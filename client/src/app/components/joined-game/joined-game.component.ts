import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { WebSocketService } from '../../services/web-socket.service';
import { fadeInOut } from '../../animations/fadeInOut.animation';
import { animateTimerPage } from '../../models/config';
import { Game } from '../../models/game.interface';
import { Player } from '../../models/player.interface';
import { Question } from '../../models/question.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-joined-game',
  templateUrl: './joined-game.component.html',
  styleUrls: ['./joined-game.component.css'],
  animations: [fadeInOut]
})

export class JoinedGameComponent implements OnInit {
  private show: boolean;
  private username: string;
  private status: string = "Getting other players...";
  private removeTextAnimation;
  private addTextAnimation;
  private gameStart: Subscription;
  private newPlayer: Subscription;
  private playerLeft: Subscription;
  private countdown: Subscription;
  private game: Game;
  private gamePin: string;
  private playerList: Player[] = [];
  private gameStarted: boolean = false;
  private currentQuestion: Question;
  private highestScore: number = 0;

  constructor(private gameService: GameService, private webSocketService: WebSocketService) { }

  public async ngOnInit() {
    setTimeout(() => {
      this.show = true;
    }, animateTimerPage);
    this.game = this.gameService.getGame();
    this.gamePin = this.gameService.getGamePin();
    this.username = this.gameService.getMyUsername();
    this.currentQuestion = this.game.questions[0];
    this.startStatusAnimation();
    this.playerList.push({
      username: `${this.username} (You)`,
      score: 0
    });
    await this.gameService.getUsers(this.gamePin)
      .then(users => {
        this.status = "Waiting for host to start game";
        users.forEach(user => {
          this.playerList.push({
            username: user.username,
            score: 0
          });
        });
      });
    this.webSocketService
      .emit("join room", {
        pin: this.gamePin,
        username: this.username
      });
    this.gameStart = this.webSocketService
      .listen('game start')
      .subscribe(() => this.gameStarted = true);
    this.newPlayer = this.webSocketService
      .listen('new player')
      .subscribe(player => this.playerList.push({
        username: player,
        score: 0
      }));
    this.playerLeft = this.webSocketService
      .listen('player left')
      .subscribe(username => this.playerList = this.playerList.filter(player => player.username !== username));
    this.countdown = this.webSocketService
      .listen('time left')
      .subscribe(time => this.game.timeLeft = time);
  }

  private startStatusAnimation():void {
      clearInterval(this.removeTextAnimation);
      this.addTextAnimation = setInterval(() => {
        this.status = this.status.concat('.'); // Add period to end
      }, 150);
      setTimeout(() => {
        clearInterval(this.addTextAnimation);
        this.removeTextAnimation = setInterval(() => {
          this.status = this.status.slice(0, -1); // Remove last character
        }, 150)
      }, 450);
      setTimeout(() => {
        clearInterval(this.removeTextAnimation);
        if (!this.gameStarted) { 
          this.status = "Waiting for host to start game"; // Keeps animation in sync
          this.startStatusAnimation(); // Keeps looping
        }
      }, 900);
  }
}
