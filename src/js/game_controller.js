import { Gameboard } from './game_board';
import { UI } from './ui_controller';

export class Game {
    constructor(isPlayerOneAI, isPlayerTwoAI) {
        this.playerOne = new Gameboard(isPlayerOneAI);
        this.playerTwo = new Gameboard(isPlayerTwoAI);
        this.activePlayer = this.playerOne;

        UI.renderBoard(document.querySelector('.board.placement'), this.playerOne.board);
    }

    startGame() {
        this.playerTwo.generateAIBoard();
        console.log(this.playerTwo.board);
        console.log('GAME START');
        // UI.removeShipBtns();
        // UI.toDualBoardView();
    }

    switchActivePlayer() {
        this.activePlayer = this.activePlayer === this.playerOne ? this.playerTwo : this.playerOne;
    }
}