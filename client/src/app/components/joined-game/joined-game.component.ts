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
  private playerAnswered: Subscription;
  private correctAnswer: Subscription;
  private allPlayersAnswered: Subscription;
  private game: Game;
  private gamePin: string;
  private playerList: Player[] = [];
  private gameStarted: boolean = false;
  private answeringQuestion: boolean = false;
  private animateText: boolean;
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
    this.animateText = true;
    this.startStatusAnimation("Waiting for host to start game");
    this.playerList.push({
      username: this.username,
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
      .subscribe(() => {
        this.gameStarted = true;
        this.answeringQuestion = true;
        this.animateText = false;
      });
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
      .subscribe(time => {
        this.game.timeLeft = time;

        if (time === 0) { this.answeringQuestion = false }
      });
    this.playerAnswered = this.webSocketService
      .listen('answered question')
      .subscribe(data => {
        this.playerList.forEach(player => {
          if (player.username === data.username) {
            player.answerIndex = data.answerIndex;
            return;
          }
        });
      });
    this.correctAnswer = this.webSocketService
      .listen('correct answer')
      .subscribe(correctAnswer => {
        this.animateText = false;
        this.status = "Loading next question";
        this.playerList.forEach(player => {
          if (player.answerIndex === correctAnswer) {
            player.score++;
            this.playerList.sort((first, second) => second.score - first.score); // Sort scoreboard
            if (player.score > this.highestScore) {
              this.highestScore = player.score;
            }
          }

          player.answerIndex = null;
        });
      });
    this.allPlayersAnswered = this.webSocketService
      .listen('all players answered')
      .subscribe(correctAnswer => {
        this.animateText = false;
        this.status = "Loading next question";
        this.game.timeLeft = 0;
        this.playerList.forEach(player => {
          if (player.answerIndex === correctAnswer) {
            player.score++;
            this.playerList.sort((first, second) => second.score - first.score); // Sort scoreboard
            if (player.score > this.highestScore) {
              this.highestScore = player.score;
            }
          }

          player.answerIndex = null;
        });
      });
  }

  private startStatusAnimation(text: string):void {
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
        if (this.animateText) { 
          this.status = text; // Keeps animation in sync
          this.startStatusAnimation(text); // Keeps looping
        }
      }, 900);
  }

  private answerQuestion(index: number):void {
    this.answeringQuestion = false;
    this.status = "Waiting for other players to answer";
    this.animateText = true;
    this.startStatusAnimation("Waiting for other players to answer");
    this.playerList.forEach(player => {
      if (player.username === this.username) {
        player.answerIndex = index;
        return;
      }
    });
    this.webSocketService
      .emit('answered question', {
        pin: this.gamePin,
        username: this.username,
        answerIndex: index
      });
  }
}
