import { Question } from './question.interface';

export interface Game {
    pin: number,
    questions: Question[]
}