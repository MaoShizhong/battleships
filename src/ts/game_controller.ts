import { Gameboard } from './game_board';
import { UI } from './ui_controller';

export class Game {
    playerOne: Gameboard;
    playerTwo: Gameboard;
    activePlayer: Gameboard;
    otherPlayer: Gameboard;

    constructor() {
        this.playerOne = new Gameboard(false, '.player-one');
        this.playerTwo;
        this.activePlayer = this.playerOne;
        this.otherPlayer;

        UI.renderBoard(document.querySelector('.board.placement'), this.playerOne.board, false);
    }

    startGame(): void {
        UI.disablePlacementMode();
        UI.toggleShipBtns();
        UI.toDualBoardView();

        this.playerTwo = new Gameboard(true, '.player-two');
        this.playerTwo.generateAIBoard();
        this.otherPlayer = this.playerTwo;
    }

    switchActivePlayer(): void {
        [this.activePlayer, this.otherPlayer] = [this.otherPlayer, this.activePlayer];

        UI.switchCurrentPlayerIndicator(this.activePlayer.player.isAI);

        if (this.activePlayer.player.isAI) {
            this.activePlayer.player.attackOpponent(this.otherPlayer);
        } else {
            UI.disableAllButtons(false);
        }
    }

    showWinner(name: string): void {
        UI.clearMain();

        const winner = document.createElement('h1');
        winner.innerText = `${name} ${name === 'You' ? 'win' : 'wins'}!\nClick to play again`;
        winner.id = 'winner';
        winner.addEventListener('click', (): void => location.reload());

        document.querySelector('main').appendChild(winner);
    }
}
