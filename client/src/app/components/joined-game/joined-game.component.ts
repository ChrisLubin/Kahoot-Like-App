import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../../services/game.service';
import { WebSocketService } from '../../services/web-socket.service';
import { fadeInOut } from '../../animations/fadeInOut.animation';
import { animateTimer, animateTimerPage, displayStatusTimer } from '../../models/config';
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

export class JoinedGameComponent implements OnInit, OnDestroy {
  private show: boolean;
  private username: string;
  private status: string = "Getting other players...";
  private placement: string = "You're tied for 1st place";
  private removeTextAnimation;
  private addTextAnimation;
  private subscriptions: Subscription[] = [];
  private gameStart: Subscription;
  private newPlayer: Subscription;
  private playerLeft: Subscription;
  private countdown: Subscription;
  private playerAnswered: Subscription;
  private correctAnswer: Subscription;
  private allPlayersAnswered: Subscription;
  private nextQuestion: Subscription;
  private gameOver: Subscription;
  private game: Game;
  private gamePin: string;
  private playerList: Player[] = [];
  private gameStarted: boolean = false;
  private answeringQuestion: boolean = false;
  private animateText: boolean;
  private currentQuestion: Question;
  private highestScore: number = 0;

  constructor(private gameService: GameService, private webSocketService: WebSocketService) { }

  public ngOnInit() {
    setTimeout(() => {
      this.show = true;
    }, (4 * animateTimer) + displayStatusTimer + animateTimerPage);
    this.game = this.gameService.getGame();
    this.gamePin = this.gameService.getGamePin();
    this.username = this.gameService.getMyUsername();
    this.currentQuestion = this.game.questions[0];
    this.animateText = true;
    this.playerList.push({
      username: this.username,
      score: 0
    });
    this.gameService.getUsers(this.gamePin)
      .then(users => {
        this.status = "Waiting for host to start game";
        this.startStatusAnimation("Waiting for host to start game");
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
        this.removeSubscription(this.gameStart);
        this.removeSubscription(this.newPlayer);
        this.removeSubscription(this.playerLeft);
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
      .subscribe(correctAnswer => this.updateScoreboard(correctAnswer));
    this.allPlayersAnswered = this.webSocketService
      .listen('all players answered')
      .subscribe(correctAnswer => this.updateScoreboard(correctAnswer));
    this.nextQuestion = this.webSocketService
      .listen('next question')
      .subscribe(() => {
        this.animateText = false;
        this.game.currentQuestionIndex++;
        this.currentQuestion = this.game.questions[this.game.currentQuestionIndex];
        this.answeringQuestion = true;
      });
    this.gameOver = this.webSocketService
      .listen('game over')
      .subscribe(() => {
        this.subscriptions.forEach(subscription => subscription.unsubscribe()); // Unsubscribe from all subscriptions
        this.subscriptions = [];
        this.animateText = false;
        this.status = "Game over!";
        this.updatePlacement(true);
        this.answeringQuestion = false;
      });

    // Add all subscriptions to array
    this.subscriptions.push(this.gameStart);
    this.subscriptions.push(this.newPlayer);
    this.subscriptions.push(this.playerLeft);
    this.subscriptions.push(this.countdown);
    this.subscriptions.push(this.playerAnswered);
    this.subscriptions.push(this.correctAnswer);
    this.subscriptions.push(this.allPlayersAnswered);
    this.subscriptions.push(this.nextQuestion);
    this.subscriptions.push(this.gameOver);
  }

  ngOnDestroy():void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
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

  private updateScoreboard(correctAnswer: number):void {
    this.animateText = false;
    this.status = "Loading next question";
    this.game.timeLeft = 0;
    this.playerList.forEach(player => {
      if (player.answerIndex === correctAnswer) {
        player.score++;
        this.playerList.sort((first, second) => second.score - first.score); // Sort scoreboard
        this.updatePlacement(false);
        if (player.score > this.highestScore) {
          this.highestScore = player.score;
        }
      }

      player.answerIndex = null;
    });
  }

  private updatePlacement(gameOver: boolean):void {
    const currentScores = [];
    let myScore;
    let tied = false; // Boolean for if user is tied for a placement
    let placement = 1;
    let abbreviation; // Abbreviation for placement

    this.playerList.forEach(player => {
      // Get my score
      if (player.username === this.username) {
        myScore = player.score;
        return;
      }
    });
    this.playerList.forEach(player => {
      // Calculate current placement
      if (player.score > myScore && !currentScores.includes(player.score)) {
        currentScores.push(player.score);
        placement++;
      } else if (player.score === myScore && player.username !== this.username) {
        tied = true;
        return;
      } else {
        return;
      }
    });

    // Determine abbreviation of placement
    const lastNum = parseInt(placement.toString().split('').pop());

    if (lastNum === 1) {
      abbreviation = "st";
    } else if (lastNum === 2) {
      abbreviation = "nd";
    } else if (lastNum === 3) {
      abbreviation = "rd";
    } else {
      abbreviation = "th";
    }

    if (!gameOver) {
      this.placement = `You're ${tied ? 'tied for' : 'in'} ${placement}${abbreviation} place`;
    } else {
      this.placement = `You ${tied ? 'tied for' : 'got'} ${placement}${abbreviation} place!`;
    }
  }

  private removeSubscription(subscription: Subscription):void {
    subscription.unsubscribe();
    this.subscriptions = this.subscriptions.filter(sub => sub !== subscription); // Remove subscription from array
  }
}
