import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../animations/fadeInOut.animation';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css'],
  animations: [
    fadeInOut
  ]
})
export class JoinGameComponent implements OnInit {
  private joiningGame: boolean; // True if user attempts to join a game
  private gameCode: number;
  private gameCodeRegex: RegExp;
  private joinButtonText: string = "Join";

  ngOnInit() {
    this.joiningGame = false;
    this.gameCodeRegex = /^[0-9]*$/;
    this.joinButtonText = "Join";
  }

  public attemptJoinGame(): void {
    this.joiningGame = true;
  }
}
