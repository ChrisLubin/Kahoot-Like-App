import { Choice } from './choice.interface';

export interface Question {
    question: string,
    choices: Choice[],
}