import { Gameboard } from './game_board';

export class Placement {
    static inDeleteMode = false;
    static currentShipOrientation = 'horizontal';
    static currentShipSize = 5;

    static changeShipSize(btn) {
        Placement.currentShipSize = +btn.value;

        document.querySelector('.current').classList.remove('current');
        btn.classList.add('current');
    }

    static changeDirection() {
        Placement.currentShipOrientation = Placement.currentShipOrientation === 'horizontal' ? 'vertical' : 'horizontal';

        const direction = document.querySelector('#rotate > h2');
        direction.textContent = Placement.currentShipOrientation === 'horizontal' ? 'H' : 'V';
    }

    static highlightSquares(e) {
        const square = e.target;
        if (square.tagName === 'BUTTON' && !Placement.inDeleteMode) {
            const squaresToEdge = Placement.getSquaresToEdge(square);

            const inBounds = Placement.currentShipSize <= squaresToEdge;
            square.style.backgroundColor = inBounds ? 'var(--c-red)' : 'var(--oob)';

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
            square.style.backgroundColor = mouseout ? null : inBounds ? 'var(--c-red)' : 'var(--oob)';
        }
    }

    static getNextSquareOffset() {
        return Placement.currentShipOrientation === 'horizontal' ? 1 : Gameboard.width;
    }

    static getSquaresToEdge(square) {
        return Placement.currentShipOrientation === 'horizontal'
            ? Gameboard.width - square.dataset.x
            : Gameboard.height - square.dataset.y;
    }

    static toggleDeleteMode(btn) {
        Placement.inDeleteMode = !Placement.inDeleteMode;
        btn.currentTarget.classList.toggle('current');

        const btnsToDisable = document.querySelectorAll('.ships button:not(#delete)');
        btnsToDisable.forEach(btn => {
            btn.disabled = !btn.disabled;
            btn.classList.toggle('disable');
        });
    }
}