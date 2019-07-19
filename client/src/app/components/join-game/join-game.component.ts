import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { fadeInOut } from '../../animations/fadeInOut.animation';
import { fadeInOutPage } from '../../animations/fadeInOutPage.animation';
import { animateTimer, displayStatusTimer } from '../../models/config';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css'],
  animations: [
    fadeInOut,
    fadeInOutPage
  ]
})

export class JoinGameComponent implements OnInit {
  private joiningGame: boolean; // True if user attempts to join a game
  private gamePin: string;
  private gamePinRegex: RegExp;
  private validGamePin: boolean;
  private invalidText: string;
  private joinStatus;
  private swapPage: boolean;
  @Output() goBack = new EventEmitter<string>();

  constructor(private gameService: GameService) { }

  public ngOnInit(): void {
    this.joiningGame = false;
    this.gamePinRegex = /^[0-9]*$/;
    this.validGamePin = true;
    this.joinStatus = {
      message: <string>"Loading...",
      status: <string>"",
      animate1: <boolean>true,
      animate2: <boolean>false
    }
    this.swapPage = false;
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

    // Make GET request to server
    this.gameService.joinGame(this.gamePin)
    .subscribe(res => {
      switch (res.status) {
        case 200:
          // Game found
          this.toggleJoinStatusMessage("Joining game!", "joined");
          break;
        default:
          // Received http status code that wasn't expected
          this.toggleJoinStatusMessage("Oops, something went wrong!", "error");
          break;
      }
    },
    error => {
      switch (error.status) {
        case 422:
          // Invalid game pin
          this.toggleJoinStatusMessage("Invalid pin.", "error");
          break;
        case 404:
          // Game not found
          this.toggleJoinStatusMessage("Game with pin not found.", "error");
          break;
        case 0:
          // Could not connect to server
          this.toggleJoinStatusMessage("Could not connect to server.", "error");
          break;
        default:
          // Received http status code that wasn't expected
          this.toggleJoinStatusMessage("Oops, something went wrong!", "error");
          break;
      }
    });
  }

  private toggleJoinStatusMessage(message:string, status:string):void {
    // Delays so transitions are smooth in and out of join status messages
    setTimeout(() => {
      // Swap which status message element gets shown for smooth transitions
      if (this.joinStatus.animate1) {
        this.joinStatus.animate1 = false;
        setTimeout(() => {
          this.joinStatus.animate2 = true;
          this.joinStatus.message = message;
          this.joinStatus.status = status;
        }, animateTimer)

        setTimeout(() => {
          this.joinStatus.animate2 = false;
        }, animateTimer + displayStatusTimer);
      } else {
        this.joinStatus.animate2 = false;
        setTimeout(() => {
          this.joinStatus.animate1 = true;
          this.joinStatus.message = message;
          this.joinStatus.status = status;
        }, animateTimer)

        setTimeout(() => {
          this.joinStatus.animate1 = false;
        }, animateTimer + displayStatusTimer);
      }

      if (status !== "joined") {
        // Go back to enter game pin view
        setTimeout(() => {
          this.joiningGame = false;
          this.joinStatus.status = "";
          this.joinStatus.message = "Loading...";
          this.joinStatus.animate2 = true;
        }, animateTimer + displayStatusTimer + animateTimer);
      } else {
        // Go to joined game view
        setTimeout(() => {
          this.joinStatus.message = "";
          this.joinStatus.animate2 = true;
          this.swapPage = true;
        }, animateTimer + displayStatusTimer + animateTimer);
      }
    }, (2 * animateTimer));
  }

  private goBackToMain():void {
    this.goBack.next();
  }
}
