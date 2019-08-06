import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../animations/fadeInOut.animation';
import { animateTimer } from '../../models/config';
import { GameService } from '../../services/game.service';
import { WebSocketService } from '../../services/web-socket.service';
import { Game } from '../../models/game.interface';
import { Subscription } from 'rxjs';
import { Player } from '../../models/player.interface';

@Component({
  selector: 'app-created-game',
  templateUrl: './created-game.component.html',
  styleUrls: ['./created-game.component.css'],
  animations: [fadeInOut]
})

export class CreatedGameComponent implements OnInit {
  private show: boolean = false;
  private game: Game;
  private gameStarted: boolean = false;
  private pin: number;
  private playerList: Player[] = [];
  private highestScore: number;
  private newPlayer: Subscription;
  private playerLeft: Subscription;
  private status: string = "Waiting for players to join...";

  constructor(private gameService: GameService, private webSocketService: WebSocketService) { }

  public ngOnInit():void {
    // this.playerList.sort((first, second) => second.score - first.score); // Sort scoreboard
    setTimeout(() => {
      this.show = true;
    }, animateTimer);
    this.game = this.gameService.getGame();
    this.pin = this.game.pin;
    this.webSocketService
      .connect(true)
      .then(() => {
        this.webSocketService
          .emit("join room", { pin: this.pin });
        this.newPlayer = this.webSocketService
          .listen('new player')
          .subscribe(player => this.playerList.push({
            username: player,
            score: 0
          }));
        this.playerLeft = this.webSocketService
          .listen('player left')
          .subscribe(username => this.playerList = this.playerList.filter(player => player.username !== username));
      });
  }

}
