import { Gameboard } from './game_board';
import { Placement } from './placement';
import { game } from './index';
import Cannon from '../images/cannon.png';

export class UI {
    static renderBoard(board: HTMLDivElement, cells: string[][] | null = null, isAI = true): void {
        board.replaceChildren();

        board.style.setProperty('--rows', Gameboard.HEIGHT.toString());
        board.style.setProperty('--columns', Gameboard.WIDTH.toString());

        for (let i = 0; i < Gameboard.HEIGHT; i++) {
            for (let j = 0; j < Gameboard.WIDTH; j++) {
                const square = document.createElement('button');

                if (!isAI) {
                    square.dataset.cell = cells[i][j];
                } else {
                    square.dataset.cell =
                        cells && cells[i][j].includes('sunk')
                            ? cells[i][j]
                            : cells && /^hits|miss/.test(cells[i][j])
                            ? cells[i][j].slice(0, 4)
                            : 'none';
                    square.addEventListener('click', () => game.playerTwo.receiveAttack(i, j));
                }

                square.dataset.y = i.toString();
                square.dataset.x = j.toString();
                board.appendChild(square);
            }
        }
    }

    static renderPlayerTwoBoard(): void {
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
        setTimeout((): void => UI.removeClasses([boardWrapper, center], 'small'), 1);
    }

    static createCentralDiv(): DocumentFragment {
        const frag = document.createDocumentFragment();
        const cannon = new Image();
        const playerTurn = document.createElement('h2');
        playerTurn.textContent = 'Your move';
        cannon.src = Cannon;

        [playerTurn, cannon].forEach((el) => frag.appendChild(el));

        return frag;
    }

    static reduceShipCount(name: string, newCount: number): void {
        const shipBtn = document.querySelector(
            `h4:has(+ button[value="${Placement.currentShipSize}"])`
        );
        shipBtn.innerHTML = `${name}<br>(${newCount})`;
    }

    static increaseShipCount(name: string, size: number, newCount: number): void {
        const shipBtn = document.querySelector(`h4:has(+ button[value="${size}"])`);
        shipBtn.innerHTML = `${name}<br>(${newCount})`;
    }

    static showGameStartBtn(): void {
        const startBtn = document.createElement('button');
        startBtn.id = 'start-game';
        UI.addClasses([startBtn], 'grow', 'breathe');
        startBtn.textContent = 'START';
        startBtn.addEventListener('click', () => game.startGame());

        const main = document.querySelector('main');
        main.insertBefore(startBtn, main.firstChild);
    }

    static toggleShipBtns(): void {
        const shipBtns = document.querySelector('.ships');
        shipBtns.classList.toggle('invisible');

        shipBtns.querySelectorAll('button').forEach((btn) => btn.classList.toggle('grow'));
    }

    static toDualBoardView(): void {
        document.querySelector('#start-game').remove();
        UI.renderPlayerTwoBoard();

        // fresh board
        UI.renderBoard(game.playerOne.UIBoard, game.playerOne.board, false);
    }

    static disablePlacementMode(): void {
        const placement = document.querySelector<HTMLDivElement>('.board.placement');
        UI.removeClasses([placement], 'placement');

        const eventListeners: { [index: string]: EventListener } = {
            mouseover: Placement.highlightSquares,
            mouseout: Placement.removeHighlightOnMouseout,
            click: Placement.placeShip,
        };

        for (const [listener, callback] of Object.entries(eventListeners)) {
            placement.removeEventListener(listener as keyof HTMLElementEventMap, callback);
        }
    }

    static clearMain(): void {
        document.querySelector('main').replaceChildren();
    }

    static switchCurrentPlayerIndicator(currentIsAI: boolean): void {
        const indicator = document.querySelector<HTMLDivElement>('.cannon');

        const firstChild = indicator.firstElementChild as HTMLElement;
        const lastChild = indicator.lastElementChild as HTMLElement;

        firstChild.style.opacity = currentIsAI ? '0.4' : '1';
        firstChild.style.animation = currentIsAI ? '600ms linear alternate infinite blink' : null;
        firstChild.textContent = currentIsAI ? "CPU's move" : 'Your move';
        lastChild.style.transform = `scaleX(${currentIsAI ? -1 : 1})`;
    }

    static disableAllButtons(isDisabled: boolean): void {
        const allBtns = document.querySelectorAll('button');
        allBtns.forEach((btn) => (btn.disabled = isDisabled));
    }

    static addClasses(els: Element[], ...classes: string[]): void {
        els.forEach((el) => {
            classes.forEach((arg) => el.classList.add(arg));
        });
    }

    static removeClasses(els: Element[], ...classes: string[]): void {
        els.forEach((el) => {
            classes.forEach((arg) => el.classList.remove(arg));
        });
    }
}
