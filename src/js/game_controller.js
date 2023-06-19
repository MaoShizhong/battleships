import { Gameboard } from './game_board';
import { UI } from './ui_controller';

export class Game {
    constructor() {
        this.playerOne = new Gameboard('#player-one', false);
        this.playerTwo;
        this.activePlayer = this.playerOne;

        UI.renderBoard(document.querySelector('.board.placement'), this.playerOne.board, false);
        UI.showGameStartBtn();
    }

    startGame() {
        UI.disablePlacementMode();
        UI.toggleShipBtns();
        UI.toDualBoardView();

        this.playerTwo = new Gameboard('#player-two', true);
        this.playerTwo.generateAIBoard();
        console.log(this.playerTwo.board);
    }

    switchActivePlayer() {
        this.activePlayer = this.activePlayer === this.playerOne ? this.playerTwo : this.playerOne;
    }
}