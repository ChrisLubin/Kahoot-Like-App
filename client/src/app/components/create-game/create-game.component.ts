import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { fadeInOut } from '../../animations/fadeInOut.animation';
import { Question } from '../../models/question.interface';
import { CreateQuestionInputs } from '../../models/create-question';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css'],
  animations: [fadeInOut]
})

export class CreateGameComponent implements OnInit, OnDestroy {
  private questions: Question[];
  private inputFields;
  private creatingGame: boolean = false;
  private gameCreated: boolean = false;
  private status: string;
  @Output() goBack = new EventEmitter<string>();
  @Output() hideHeader = new EventEmitter<string>();

  constructor(private gameService: GameService) { }

  public ngOnInit():void {
    this.inputFields = CreateQuestionInputs;
    this.questions = [];
  }

  public ngOnDestroy():void {
    // Reset fields
    for (let key of Object.keys(this.inputFields)) {
      this.inputFields[key].input = "";
      this.inputFields[key].valid = true;
    }
  }

  private addQuestion():void {
    const valid = this.areInputsValid();

    if (!valid) { return }

    const question:Question = {
      question: this.inputFields.question.input,
      correctIndex: parseInt(this.inputFields.correctIndex.input),
      choices: [
        this.inputFields.choiceOne.input,
        this.inputFields.choiceTwo.input,
        this.inputFields.choiceThree.input,
        this.inputFields.choiceFour.input
      ]};
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

  private correctAnswerIsValid():void {
    this.inputFields.correctIndex.valid = true;
  }

  private createGame():void {
    if (!this.questions.length) {
      // No questions created
      for (let key of Object.keys(this.inputFields)) {
        if (!this.inputFields[key].input.trim()) {
          // Show red on empty create question fields
          this.inputFields[key].input = "";
          this.inputFields[key].valid = false;
        }
      }
      return;
    }

    this.creatingGame = true;
    this.status = "Creating game...";

    this.gameService.createGame(this.questions)
      .then(game => {
        this.status = "Game created!";
        this.gameService.setGamePin(game.pin);
        this.gameService.setGame(game);
        this.gameCreated = true;
        this.hideHeader.next();
      });
  }

  private goBackToMain():void {
    this.goBack.next();
  }
}
