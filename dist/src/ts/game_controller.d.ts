import { Gameboard } from './game_board';
export declare class Game {
    playerOne: Gameboard;
    playerTwo: Gameboard;
    activePlayer: Gameboard;
    otherPlayer: Gameboard;
    constructor();
    startGame(): void;
    switchActivePlayer(): void;
    showWinner(name: string): void;
}
