import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { WebSocketService } from '../../services/web-socket.service';
import { fadeInOut } from '../../animations/fadeInOut.animation';
import { animateTimerPage } from '../../models/config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-joined-game',
  templateUrl: './joined-game.component.html',
  styleUrls: ['./joined-game.component.css'],
  animations: [fadeInOut]
})
export class JoinedGameComponent implements OnInit {
  private show: boolean;
  private gamePin: string;
  private username: string;
  private playerList: string[] = [];
  private gameStarted: boolean = false;
  private status: string = "Getting other players...";
  private removeTextAnimation;
  private addTextAnimation;
  private newPlayers: Subscription;

  constructor(private gameService: GameService, private webSocketService: WebSocketService) { }

  public async ngOnInit() {
    setTimeout(() => {
      this.show = true;
    }, animateTimerPage);
    this.gamePin = this.gameService.getGamePin();
    this.username = this.gameService.getMyUsername();
    this.playerList.push(`${this.username} (You)`);
    await this.gameService.getUsers(this.gamePin)
      .then(users => {
        this.status = "Waiting for host to start game";
        users.forEach(user => {
          this.playerList.push(user.username);
        });
      });
    this.webSocketService
      .emit("join room", {
        pin: this.gamePin,
        username: this.username
      });
    this.newPlayers = this.webSocketService
      .listen('new player')
      .subscribe(player => {
        this.playerList.push(player);
      });
    this.startStatusAnimation();
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
