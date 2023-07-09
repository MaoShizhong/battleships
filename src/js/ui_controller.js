import { Gameboard } from './game_board';
import { Placement } from './placement';
import { game } from './index';
import Cannon from '../images/cannon.png';

export class UI {
    static renderBoard(board, cells, isAI = true) {
        board.replaceChildren();

        for (let i = 0; i < Gameboard.WIDTH; i++) {
            for (let j = 0; j < Gameboard.HEIGHT; j++) {
                const square = document.createElement('button');

                if (!isAI) {
                    square.dataset.cell = cells[i][j];
                } else if (isAI) {
                    square.dataset.cell =
                        cells && cells[i][j].includes('sunk')
                            ? cells[i][j]
                            : cells && /^hits|miss/.test(cells[i][j])
                            ? cells[i][j].slice(0, 4)
                            : 'none';
                    square.addEventListener('click', () => game.playerTwo.receiveAttack(i, j));
                }

                square.dataset.y = i;
                square.dataset.x = j;
                board.appendChild(square);
            }
        }
    }

    static renderPlayerTwoBoard() {
        // wrapper required to flex grow whilst child board maintains aspect ratio
        // for css transition purposes
        const boardWrapper = document.createElement('div');
        UI.addClasses([boardWrapper], 'flex', 'even', 'small');

        const board = document.createElement('div');
        UI.addClasses([board], 'board', 'player-two');

        const center = document.createElement('div');
        UI.addClasses([center], 'small', 'cannon');
        center.appendChild(UI.createCentralDiv());

        const playWindow = document.querySelector('#boards');
        UI.addClasses([playWindow], 'mob-vert');
        playWindow.appendChild(center);
        playWindow.appendChild(boardWrapper).appendChild(board);
        UI.renderBoard(board);

        // Omitting timeout prevents transition after .appendChild()
        // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions#:~:text=Note%3A%20Care,to%20transition%20to.
        setTimeout(() => UI.removeClasses([boardWrapper, center], 'small'), 1);
    }

    static createCentralDiv() {
        const frag = document.createDocumentFragment();
        const cannon = new Image();
        const playerTurn = document.createElement('h2');
        playerTurn.textContent = 'Your move';
        cannon.src = Cannon;

        [playerTurn, cannon].forEach((el) => frag.appendChild(el));

        return frag;
    }

    static reduceShipCount(name, newCount) {
        const shipBtn = document.querySelector(`h4:has(+ button[value="${Placement.currentShipSize}"])`);
        shipBtn.innerHTML = `${name}<br>(${newCount})`;
    }

    static increaseShipCount(name, size, newCount) {
        const shipBtn = document.querySelector(`h4:has(+ button[value="${size}"])`);
        shipBtn.innerHTML = `${name}<br>(${newCount})`;
    }

    static showGameStartBtn() {
        const startBtn = document.createElement('button');
        startBtn.id = 'start-game';
        UI.addClasses([startBtn], 'grow', 'breathe');
        startBtn.textContent = 'START';
        startBtn.addEventListener('click', () => game.startGame());

        const main = document.querySelector('main');
        main.insertBefore(startBtn, main.firstChild);
    }

    static toggleShipBtns() {
        const shipBtns = document.querySelector('.ships');
        shipBtns.classList.toggle('invisible');

        shipBtns.querySelectorAll('button').forEach((btn) => btn.classList.toggle('grow'));
    }

    static toDualBoardView() {
        document.querySelector('#start-game').remove();
        UI.renderPlayerTwoBoard();

        // fresh board
        UI.renderBoard(game.playerOne.UIBoard, game.playerOne.board, false);
    }

    static disablePlacementMode() {
        const placement = document.querySelector('.board.placement');
        UI.removeClasses([placement], 'placement');

        const eventListeners = {
            mouseover: Placement.highlightSquares,
            mouseout: Placement.removeHighlightOnMouseout,
            click: Placement.placeShip,
        };

        for (const listener in eventListeners) placement.removeEventListener(listener, eventListeners[listener]);
    }

    static clearMain() {
        document.querySelector('main').replaceChildren();
    }

    static switchCurrentPlayerIndicator(currentIsAI) {
        const indicator = document.querySelector('.cannon');

        indicator.firstChild.style.opacity = currentIsAI ? 0.4 : 1;
        indicator.firstChild.style.animation = currentIsAI ? '600ms linear alternate infinite blink' : null;
        indicator.firstChild.textContent = currentIsAI ? "CPU's move" : 'Your move';
        indicator.lastChild.style.transform = `scaleX(${currentIsAI ? -1 : 1})`;
    }

    static disableAllButtons(toDisable) {
        const allBtns = document.querySelectorAll('button');
        allBtns.forEach((btn) => (btn.disabled = toDisable));
    }

    static addClasses(els, ...classes) {
        els.forEach((el) => {
            classes.forEach((arg) => el.classList.add(arg));
        });
    }

    static removeClasses(els, ...classes) {
        els.forEach((el) => {
            classes.forEach((arg) => el.classList.remove(arg));
        });
    }
}
