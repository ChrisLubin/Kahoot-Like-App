import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../animations/fadeInOut.animation';
import { blockInitialRender } from '../../animations/blockInitialRender.animation';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.css'],
  animations: [
    fadeInOut,
    // Work around so buttons aren't animated on page load
    blockInitialRender
  ]
})

export class KahootInitialComponent implements OnInit {
  private joinGame: boolean; // True if user clicks first join game button
  private joiningGame: boolean; // True if user attempts to join a game
  private gameCode: number;
  private joinButtonText: string;

  public ngOnInit(): void {
    this.joinGame = false;
    this.joiningGame = false;
    this.joinButtonText = "Join";
  }

  public toggleJoinGame(): void {
    this.joinGame = !this.joinGame;
  }

  public attemptJoinGame(): void {
    this.joiningGame = true;
  }
}
