import { Choice } from './choice.interface';

export interface Question {
    question: string,
    correctIndex: number,
    choices: Choice[]
}