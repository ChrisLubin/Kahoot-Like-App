import { Question } from './question.interface';

export interface Game {
    pin: number,
    currentQuestion: number,
    questions: Question[]
}