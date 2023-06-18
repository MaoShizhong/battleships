import { Gameboard } from './game_board';
import { Placement } from './placement';
import { game } from './index';

export class UI {
    static renderBoard(board, cells) {
        board.replaceChildren();

        for (let i = 0; i < Gameboard.width; i++) {
            for (let j = 0; j < Gameboard.height; j++) {
                const square = document.createElement('button');

                square.dataset.cell = cells[i][j];
                square.dataset.y = i;
                square.dataset.x = j;
                board.appendChild(square);
            }
        }
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
        UI.addClasses(startBtn, 'grow', 'breathe');
        startBtn.textContent = 'START';
        startBtn.addEventListener('click', () => game.startGame());

        const main = document.querySelector('main');
        main.insertBefore(startBtn, main.firstChild);
    }

    static addClasses(el, ...classes) {
        classes.forEach(arg => el.classList.add(arg));
    }
}