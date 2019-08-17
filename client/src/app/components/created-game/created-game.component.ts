import { Component, OnInit, OnDestroy } from '@angular/core';
import { fadeInOut } from '../../animations/fadeInOut.animation';
import { animateTimer } from '../../models/config';
import { GameService } from '../../services/game.service';
import { WebSocketService } from '../../services/web-socket.service';
import { Game } from '../../models/game.interface';
import { Question } from '../../models/question.interface';
import { Subscription } from 'rxjs';
import { Player } from '../../models/player.interface';

@Component({
  selector: 'app-created-game',
  templateUrl: './created-game.component.html',
  styleUrls: ['./created-game.component.css'],
  animations: [fadeInOut]
})

export class CreatedGameComponent implements OnInit, OnDestroy {
  public show: boolean = false;
  public game: Game;
  public gameStarted: boolean = false;
  public gameFinished: boolean = false;
  public pin: number;
  public playerList: Player[] = [];
  public currentQuestion: Question;
  public highestScore: number = 0;
  private subscriptions: Subscription[] = [];
  private newPlayer: Subscription;
  private playerLeft: Subscription;
  private allPlayersLeft: Subscription;
  private countdown: Subscription;
  private playerAnswered: Subscription;
  private nextQuestion: Subscription;
  private gameOver: Subscription;
  public status: string = "Waiting for players to join...";

  constructor(private gameService: GameService, private webSocketService: WebSocketService) { }

  public ngOnInit():void {
    setTimeout(() => {
      this.show = true;
    }, animateTimer);
    this.game = this.gameService.getGame();
    this.pin = this.game.pin;
    this.currentQuestion = this.game.questions[0];
    this.webSocketService
      .connect(true)
      .then(() => {
        this.webSocketService
          .emit("join room", this.game);
        this.newPlayer = this.webSocketService
          .listen('new player')
          .subscribe(player => this.playerList.push({
            username: player,
            score: 0
          }));
        this.playerLeft = this.webSocketService
          .listen('player left')
          .subscribe(username => this.playerList = this.playerList.filter(player => player.username !== username));

        // Add subscriptions to array
        this.subscriptions.push(this.newPlayer);
        this.subscriptions.push(this.playerLeft);
      });
  }

  ngOnDestroy():void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public startGame():void {
    this.removeSubscription(this.newPlayer);
    this.removeSubscription(this.playerLeft);
    this.gameStarted = true;
    this.status = `Players are answering question ${this.game.currentQuestionIndex + 1} out of ${this.game.questions.length}.`;
    this.webSocketService
      .emit('game start', this.pin);
    this.allPlayersLeft = this.webSocketService
      .listen('all players left')
      .subscribe(() => {
        this.game.timeLeft = 0;
        this.status = "All players left!";
        this.gameFinished = true;

        // Unsubscribe from all subscriptions
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
      });
    this.countdown = this.webSocketService
      .listen('time left')
      .subscribe(time => this.game.timeLeft = time);
    this.playerAnswered = this.webSocketService
      .listen('answered question')
      .subscribe(data => {
        if (data.answerIndex === this.currentQuestion.correctIndex) {
          this.playerList.forEach(player => {
            if (player.username === data.username) {
              player.score++;
              this.playerList.sort((first, second) => second.score - first.score); // Sort scoreboard
              if (player.score > this.highestScore) {
                this.highestScore = player.score;
              }
              return;
            }
          });
        }
      });
    this.nextQuestion = this.webSocketService
      .listen('next question')
      .subscribe(() => {
        this.game.currentQuestionIndex++;
        this.currentQuestion = this.game.questions[this.game.currentQuestionIndex];
        this.status = `Players are answering question ${this.game.currentQuestionIndex + 1} out of ${this.game.questions.length}.`;
      });
    this.gameOver = this.webSocketService
      .listen('game over')
      .subscribe(() => {
        this.subscriptions.forEach(subscription => subscription.unsubscribe()); // Unsubscribe from all subscriptions
        this.subscriptions = [];
        this.status = "Game over!";
        this.gameFinished = true;
      });

    // Add subscriptions to array
    this.subscriptions.push(this.allPlayersLeft);
    this.subscriptions.push(this.countdown);
    this.subscriptions.push(this.playerAnswered);
    this.subscriptions.push(this.nextQuestion);
    this.subscriptions.push(this.gameOver);
  }

  private removeSubscription(subscription: Subscription):void {
    subscription.unsubscribe();
    this.subscriptions = this.subscriptions.filter(sub => sub !== subscription); // Remove subscription from array
  }
}
