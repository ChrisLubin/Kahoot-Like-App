import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../animations/fadeInOut.animation';
import { Question } from '../../models/question.interface';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css'],
  animations: [fadeInOut]
})
export class CreateGameComponent implements OnInit {
  private questions: Question[];

  constructor() { }

  ngOnInit() {
    this.questions = [{ question: "Question 1", choices: [{ choice: 'Choice 1' }, { choice: 'Choice 2' }]}, { question: "Question 2", choices: [{ choice: 'Choice 1' }, { choice: 'Choice 2' }]}]; // Temporary
  }
}
