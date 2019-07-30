import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { fadeInOut } from '../../animations/fadeInOut.animation';
import { Question } from '../../models/question.interface';
import { CreateQuestionInputs } from '../../models/create-question';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css'],
  animations: [fadeInOut]
})
export class CreateGameComponent implements OnInit {
  private questions: Question[];
  private inputFields;
  @Output() goBack = new EventEmitter<string>();

  constructor() { }

  public ngOnInit():void {
    this.inputFields = CreateQuestionInputs;
    this.questions = [];
  }

  private addQuestion():void {
    const valid = this.areInputsValid();

    if (!valid) { return }

    const question:Question = {
      question: this.inputFields.question.input,
      choices: [{
          choice: this.inputFields.choiceOne.input
        },
        {
          choice: this.inputFields.choiceTwo.input
        },
        {
          choice: this.inputFields.choiceThree.input
        },
        {
          choice: this.inputFields.choiceFour.input
        }]
      };
    this.questions.push(question);

    // Reset input fields
    for (let key of Object.keys(this.inputFields)) {
        this.inputFields[key].input = "";
        this.inputFields[key].valid = true;
    }
  }

  private deleteQuestion(questionToDelete: Question):void {
    this.questions = this.questions.filter(question => question !== questionToDelete);
  }

  private areInputsValid():boolean {
    let valid = true;

    // Reset red placeholders
    for (let key of Object.keys(this.inputFields)) {
      this.inputFields[key].valid = true;
    }

    // Validation checks
    for (let key of Object.keys(this.inputFields)) {
      if (!this.inputFields[key].input.trim()) {
        this.inputFields[key].input = "";
        this.inputFields[key].valid = false;
        valid = false;
      }
    }

    return valid;
  }

  private goBackToMain():void {
    this.goBack.next();
  }
}
