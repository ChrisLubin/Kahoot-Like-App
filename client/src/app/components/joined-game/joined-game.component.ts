import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { fadeInOut } from '../../animations/fadeInOut.animation';
import { animateTimerPage } from '../../models/config';

@Component({
  selector: 'app-joined-game',
  templateUrl: './joined-game.component.html',
  styleUrls: ['./joined-game.component.css'],
  animations: [fadeInOut]
})
export class JoinedGameComponent implements OnInit {
  private show: boolean;
  private gamePin: string;
  private playerList: string[];
  private gameStarted: boolean;
  private status: string;
  private removeAnimation;
  private addAnimation;

  constructor(private gameService: GameService) { }

  public ngOnInit(): void {
    setTimeout(() => {
      this.show = true;
    }, animateTimerPage);
    this.playerList = ['Chris', 'Paul', 'Fred', 'Ginobili', 'Ginobili', 'Ginobili', 'Ginobili', 'Ginobili', 'Ginobili', 'Ginobili']; // Temporary
    this.gamePin = this.gameService.getGamePin();
    this.gameStarted = false;
    this.status = "Waiting for host to start game";
    this.startStatusAnimation();
  }

  private startStatusAnimation():void {
      clearInterval(this.removeAnimation);
      this.addAnimation = setInterval(() => {
        this.status = this.status.concat('.'); // Add period to end
      }, 150);
      setTimeout(() => {
        clearInterval(this.addAnimation);
        this.removeAnimation = setInterval(() => {
          this.status = this.status.slice(0, -1); // Remove last character
        }, 150)
      }, 450);
      setTimeout(() => {
        clearInterval(this.removeAnimation);
        if (!this.gameStarted) { 
          this.status = "Waiting for host to start game"; // Keeps animation in sync
          this.startStatusAnimation(); // Keeps looping
        }
      }, 900);
  }
}
