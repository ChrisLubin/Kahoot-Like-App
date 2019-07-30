import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { WebSocketService } from '../../services/web-socket.service';
import { fadeInOut } from '../../animations/fadeInOut.animation';
import { fadeInOutPage } from '../../animations/fadeInOutPage.animation';
import { animateTimer, displayStatusTimer } from '../../models/config';
import { Subscription } from 'rxjs';

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
  private findingGame: boolean;
  private foundGame: boolean;
  private connectingToGame: boolean;
  private gamePin: string;
  private username: string;
  private gamePinRegex: RegExp;
  private validGamePin: boolean;
  private validUsername: boolean;
  private invalidText: string;
  private foundStatus;
  private swapPage: boolean;
  private connect: Subscription;
  @Output() goBack = new EventEmitter<string>();
  @Output() hideHeader = new EventEmitter<string>();

  constructor(private gameService: GameService, private webSocketService:WebSocketService) { }

  public ngOnInit(): void {
    this.findingGame = false;
    this.foundGame = false;
    this.connectingToGame = false;
    this.gamePinRegex = /^[0-9]*$/;
    this.validGamePin = true;
    this.validUsername = true;
    this.foundStatus = {
      message: <string>"Searching...",
      status: <string>"",
      animate1: <boolean>true,
      animate2: <boolean>false
    }
    this.swapPage = false;

    this.connect = this.webSocketService.listenToConnect().subscribe(connected => {
      if (connected) {
        this.updateStatusMessage("Connected!", "connected");
        this.gameService.setMyUsername(this.username);
        this.connect.unsubscribe(); // No need to listen to connect events anymore
      } else {
        this.updateStatusMessage("Could not connect!", "could not connect");
      }
    });
  }

  private checkGamePinInput(): void {
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

  private checkUsernameInput(): void {
    // Validation checks
    if (this.username.length === 0) {
      this.validUsername = true;
      this.invalidText = "";
      return;
    } else if (this.username.length > 10) {
      this.validUsername = false;
      this.invalidText = "Username is too long.";
      return;
    }

    this.username = this.username.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // Sanitize
    this.validUsername = true;
  }

  private findGame(): void {
    try {
      // Validation checks
      if (!this.validGamePin) {
        return;
      } else if (this.gamePin.length === 0) {
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

    this.findingGame = true;

    // Make GET request to server
    this.gameService.findGame(this.gamePin)
      .subscribe(res => {
        switch (res.status) {
          case 200:
            // Game found
            this.updateStatusMessage("Found game!", "found");
            this.gameService.setGamePin(this.gamePin);
            break;
          default:
            // Received http status code that wasn't expected
            this.updateStatusMessage("Oops, something went wrong!", "error");
            break;
        }
      },
      error => {
        switch (error.status) {
          case 422:
            // Invalid game pin
            this.updateStatusMessage("Invalid pin.", "error");
            break;
          case 404:
            // Game not found
            this.updateStatusMessage("Game with pin not found.", "error");
            break;
          case 0:
            // Could not connect to server
            this.updateStatusMessage("Could not connect to server.", "error");
            break;
          default:
            // Received http status code that wasn't expected
            this.updateStatusMessage("Oops, something went wrong!", "error");
            break;
        }
      });
  }

  private joinGame():void {
    try {
      // Validation checks
      if (!this.validUsername) {
        return;
      } else if (this.username.length === 0) {
        // User entered something blank
        this.validUsername = false;
        this.invalidText = "Enter something please";
        return;
      }
    } catch(err) {
      // User entered something blank (typeof username was undefined)
      this.validUsername = false;
      this.invalidText = "Enter something please";
      return;
    }


    this.connectingToGame = true;
    this.foundStatus.animate1 = true;
    this.foundStatus.message = "Connecting...";

    // Check if name is taken
    this.gameService.getUsers(this.gamePin)
      .then(users => {
        const nameTaken = users.some(user => user.username.toLowerCase() === this.username.toLowerCase());
        if (nameTaken) {
          this.updateStatusMessage("Username taken!", "could not connect");
        } else {
          // Connect to game via WebSocket
          this.webSocketService.connect();
        }
      });
  }

  private updateStatusMessage(message:string, status:string):void {
    // Delays so transitions are smooth in and out of join status messages
    setTimeout(() => {
      // Swap which status message element gets shown for smooth transitions
      if (this.foundStatus.animate1) {
        this.foundStatus.animate1 = false;
        setTimeout(() => {
          this.foundStatus.animate2 = true;
          this.foundStatus.message = message;
          this.foundStatus.status = status;
        }, animateTimer)

        setTimeout(() => {
          this.foundStatus.animate2 = false;
        }, animateTimer + displayStatusTimer);
      } else {
        this.foundStatus.animate2 = false;
        setTimeout(() => {
          this.foundStatus.animate1 = true;
          this.foundStatus.message = message;
          this.foundStatus.status = status;
        }, animateTimer)

        setTimeout(() => {
          this.foundStatus.animate1 = false;
        }, animateTimer + displayStatusTimer);
      }

      setTimeout(() => {
        // What to do after displaying status message
        if (status === "connected") {
          // Go to joined-game view
          this.swapPage = true;
          this.hideMainHeader();
        }  else if(status === "could not connect") {
          // Go back to username prompt
          this.foundStatus.message = "";
          this.foundStatus.status = "";
          this.foundStatus.animate2 = false;
          this.connectingToGame = false;
        } else if (status === "found") {
          // Ask for username
          this.foundStatus.message = "";
          this.foundStatus.status = "";
          this.foundStatus.animate2 = false;
          this.foundGame = true;
        } else {
          // Go back to game pin view
          this.findingGame = false;
          this.foundStatus.status = "";
          this.foundStatus.message = "Searching...";
          this.foundStatus.animate2 = true;
        }
      }, animateTimer + displayStatusTimer + animateTimer);
    }, (2 * animateTimer));
  }

  private goBackToMain():void {
    this.goBack.next();
  }

  private hideMainHeader():void {
    this.hideHeader.next();
  }
}
