export interface Player {
    username: string,
    score: number,
    answerIndex?: number // Keep track of what answer a player chose
}
