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
  private gamePin: string;
  private gamePinRegex: RegExp;
  private validGamePin: boolean;
  private invalidText: string;

  public ngOnInit(): void {
    this.joiningGame = false;
    this.gamePinRegex = /^[0-9]*$/;
    this.validGamePin = true;
  }

  public checkInput(): void {
    // Clears invalid text when input empty
    if (this.gamePin.length === 0) {
      this.validGamePin = true;
      this.invalidText = "";
      return;
    }

    // Validation checks
    if (!this.gamePin.match(this.gamePinRegex)) {
      // If game pin is not only numbers
      this.validGamePin = false;
      this.invalidText = "Numbers only please";
      return;
    } else if (this.gamePin.length !== 5) {
      this.validGamePin = false;
      this.invalidText = "Pin must be 5 integers";
      return;
    }

    this.validGamePin = true;
  }

  public attemptJoinGame(): void {
    try {
      // Validation checks
      if (!this.validGamePin) {
        return;
      } else if (this.gamePin.length <= 0) {
        // User entered something blank
        this.validGamePin = false;
        this.invalidText = "Enter something please";
        return;
      }
    } catch(err) {
      // User entered something blank (typeof gamePin was undefined)
      this.validGamePin = false;
      this.invalidText = "Enter something please";
      return;
    }

    this.joiningGame = true;

    // Make get request to server...
  }
}
