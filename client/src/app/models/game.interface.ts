import { Question } from './question.interface';

export interface Game {
    gameStarted: boolean,
    currentQuestionIndex: number,
    pin: number,
    questions: Question[],
    timeLeft?: number
}