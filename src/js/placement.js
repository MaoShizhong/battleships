import { Gameboard } from './game_board';
import { game } from './index';

export class Placement {
    static inDeleteMode = false;
    static currentShipOrientation = 'horizontal';
    static currentShipSize = 5;

    static changeShipSize(e) {
        Placement.currentShipSize = +e.currentTarget.value;

        document.querySelector('.current').classList.remove('current');
        e.currentTarget.classList.add('current');
    }

    static changeDirection() {
        Placement.currentShipOrientation =
            Placement.currentShipOrientation === 'horizontal' ? 'vertical' : 'horizontal';

        const direction = document.querySelector('#rotate > h2');
        direction.textContent = Placement.currentShipOrientation === 'horizontal' ? 'H' : 'V';
    }

    static highlightSquares(e) {
        const square = e.target;
        if (square.tagName === 'BUTTON' && !Placement.inDeleteMode) {
            const squaresToEdge = Placement.getSquaresToEdge(square);

            const inBounds = Placement.currentShipSize <= squaresToEdge;

            if (!square.dataset.cell.includes('ship')) {
                square.style.backgroundColor = inBounds ? 'var(--c-red)' : 'var(--oob)';
            }

            Placement.applyBackgroundToAdjacentSquares(e.currentTarget, square, squaresToEdge, false, inBounds);
        }
    }

    static removeHighlightOnMouseout(e) {
        const square = e.target;
        if (square.tagName === 'BUTTON' && !Placement.inDeleteMode) {
            const squaresToEdge = Placement.getSquaresToEdge(square);

            square.style.backgroundColor = null;

            Placement.applyBackgroundToAdjacentSquares(e.currentTarget, square, squaresToEdge, true);
        }
    }

    static applyBackgroundToAdjacentSquares(board, square, squaresToEdge, mouseout, inBounds = false) {
        const offset = Placement.getNextSquareOffset();

        for (let i = 1; i < Math.min(Placement.currentShipSize, squaresToEdge); i++) {
            const currentIndex = [...square.parentNode.children].indexOf(square);
            square = board.querySelector(`button:nth-child(${currentIndex + offset + 1})`);
            if (!square.dataset.cell.includes('ship')) {
                square.style.backgroundColor = mouseout ? null : inBounds ? 'var(--c-red)' : 'var(--oob)';
            }
        }
    }

    static getNextSquareOffset() {
        return Placement.currentShipOrientation === 'horizontal' ? 1 : Gameboard.WIDTH;
    }

    static getSquaresToEdge(square) {
        return Placement.currentShipOrientation === 'horizontal'
            ? Gameboard.WIDTH - square.dataset.x
            : Gameboard.HEIGHT - square.dataset.y;
    }

    static placeShip(e) {
        if (e.target.tagName === 'BUTTON') {
            const y = +e.target.dataset.y;
            const x = +e.target.dataset.x;

            if (Placement.inDeleteMode) game.playerOne.deleteShip(y, x);
            else game.playerOne.placeShip(y, x);
        }
    }

    static toggleDeleteMode() {
        Placement.inDeleteMode = !Placement.inDeleteMode;

        const deleteBtn = document.querySelector('#delete');
        deleteBtn.classList.toggle('current');

        const btnsToDisable = document.querySelectorAll('.ships button:not(#delete)');
        btnsToDisable.forEach((btn) => {
            btn.disabled = !btn.disabled;
            btn.classList.toggle('disable');
        });
    }
}
