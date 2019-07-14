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
  private gameCode: string;
  private gameCodeRegex: RegExp;
  private validGameCode: boolean;
  private invalidText: string;

  public ngOnInit(): void {
    this.joiningGame = false;
    this.gameCodeRegex = /^[0-9]*$/;
    this.validGameCode = true;
  }

  public checkInput(): void {
    // Clears invalid text when input empty
    if (this.gameCode.length === 0) {
      this.validGameCode = true;
      this.invalidText = "";
      return;
    }

    // Validation checks
    if (!this.gameCode.match(this.gameCodeRegex)) {
      // If game code is not only numbers
      this.validGameCode = false;
      this.invalidText = "Numbers only please";
      return;
    } else if (this.gameCode.length !== 5) {
      this.validGameCode = false;
      this.invalidText = "Code must be 5 integers";
      return;
    }

    this.validGameCode = true;
  }

  public attemptJoinGame(): void {
    try {
      // Validation checks
      if (!this.validGameCode) {
        return;
      } else if (this.gameCode.length <= 0) {
        // User entered something blank
        this.validGameCode = false;
        this.invalidText = "Enter something please";
        return;
      }
    } catch(err) {
      // User entered something blank (typeof gameCode was undefined)
      this.validGameCode = false;
      this.invalidText = "Enter something please";
      return;
    }

    this.joiningGame = true;

    // Make get request to server...
  }
}
