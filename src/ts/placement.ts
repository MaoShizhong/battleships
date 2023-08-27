import { Gameboard } from './game_board';
import { game } from './index';

export class Placement {
    static inDeleteMode = false;
    static currentShipOrientation = 'horizontal';
    static currentShipSize = 5;

    /* 
        When different ship button clicked during placement
    */
    static changeShipSize(e: Event): void {
        const button = e.currentTarget as HTMLButtonElement;

        Placement.currentShipSize = +button.value;

        document.querySelector('.current').classList.remove('current');
        button.classList.add('current');
    }

    static changeDirection(): void {
        Placement.currentShipOrientation =
            Placement.currentShipOrientation === 'horizontal' ? 'vertical' : 'horizontal';

        const direction = document.querySelector('#rotate > h2');
        direction.textContent = Placement.currentShipOrientation === 'horizontal' ? 'H' : 'V';
    }

    static handleHighlightSquares(e: Event, isMouseOut: boolean): void {
        const square = e.target as HTMLButtonElement;

        if (square.tagName === 'BUTTON' && !Placement.inDeleteMode) {
            const squaresToEdge = Placement.getSquaresToEdge(square);

            const inBounds = isMouseOut ? false : Placement.currentShipSize <= squaresToEdge;
            let willCollide = false;

            if (!square.dataset.cell.includes('ship')) {
                square.style.backgroundColor = inBounds ? 'var(--c-red)' : 'var(--oob)';
            } else {
                willCollide = true;
            }

            Placement.applyBackgroundToAdjacentSquares(
                e.currentTarget as HTMLElement,
                square,
                squaresToEdge,
                isMouseOut,
                inBounds,
                willCollide
            );
        }
    }

    static applyBackgroundToAdjacentSquares(
        board: HTMLElement,
        square: HTMLElement,
        squaresToEdge: number,
        isMouseOut: boolean,
        inBounds: boolean,
        willCollide: boolean
    ): void {
        const offset = Placement.nextSquareOffset;

        const squares = [square];

        for (let i = 1; i < Math.min(Placement.currentShipSize, squaresToEdge); i++) {
            const currentIndex = [...square.parentNode.children].indexOf(square);
            square = board.querySelector(`button:nth-child(${currentIndex + offset + 1})`);

            if (square.dataset.cell.includes('ship')) {
                willCollide = true;
            }

            squares.push(square);
        }

        squares.forEach((square) => {
            if (!square.dataset.cell.includes('ship')) {
                square.style.backgroundColor = isMouseOut
                    ? null
                    : inBounds && !willCollide
                    ? 'var(--c-red)'
                    : 'var(--oob)';
            }
        });
    }

    static get nextSquareOffset(): number {
        return Placement.currentShipOrientation === 'horizontal' ? 1 : Gameboard.WIDTH;
    }

    static getSquaresToEdge(square: HTMLElement): number {
        return Placement.currentShipOrientation === 'horizontal'
            ? Gameboard.WIDTH - +square.dataset.x
            : Gameboard.HEIGHT - +square.dataset.y;
    }

    static placeShip(e: Event): void {
        const button = e.target as HTMLButtonElement;

        if (button.tagName === 'BUTTON') {
            const y = +button.dataset.y;
            const x = +button.dataset.x;

            if (Placement.inDeleteMode) game.playerOne.deleteShip(y, x);
            else game.playerOne.placeShip(y, x);
        }
    }

    static toggleDeleteMode(): void {
        Placement.inDeleteMode = !Placement.inDeleteMode;

        const deleteBtn = document.querySelector('#delete');
        deleteBtn.classList.toggle('current');

        const btnsToDisable: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
            '.ships button:not(#delete)'
        );
        btnsToDisable.forEach((btn) => {
            btn.disabled = !btn.disabled;
            btn.classList.toggle('disable');
        });
    }
}
