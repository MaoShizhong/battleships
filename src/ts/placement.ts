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

        // change visuals
        const direction = document.querySelector('#rotate > h2');
        direction.textContent = Placement.currentShipOrientation === 'horizontal' ? 'H' : 'V';
    }

    static handleHighlightSquares(e: Event, isMouseOut: boolean): void {
        const square = e.target as HTMLButtonElement;

        if (square.tagName !== 'BUTTON' || Placement.inDeleteMode) {
            return;
        }

        const squaresToEdge = Placement.getSquaresToEdge(square);
        const isInBounds = isMouseOut ? false : Placement.currentShipSize <= squaresToEdge;
        let willCollide = false;

        // apply colour feedback to hovered cell only
        if (!square.dataset.cell.includes('ship')) {
            square.style.backgroundColor = isInBounds ? 'var(--c-red)' : 'var(--oob)';
        } else {
            // handles when the last cell of a ship is the hovered cell
            willCollide = true;
        }

        // apply color feedback to the other relevant cells
        Placement.applyBackgroundToAdjacentSquares(
            e.currentTarget as HTMLElement,
            square,
            squaresToEdge,
            isMouseOut,
            isInBounds,
            willCollide
        );
    }

    static applyBackgroundToAdjacentSquares(
        board: HTMLElement,
        square: HTMLElement,
        squaresToEdge: number,
        isMouseOut: boolean,
        isInBounds: boolean,
        willCollide: boolean
    ): void {
        const offset = Placement.nextSquareOffset;
        const squares = [square];

        // get all button elements to be highlighted
        for (let i = 1; i < Math.min(Placement.currentShipSize, squaresToEdge); i++) {
            const currentIndex = [...square.parentNode.children].indexOf(square);
            square = board.querySelector(`button:nth-child(${currentIndex + offset + 1})`);

            if (square.dataset.cell.includes('ship')) {
                willCollide = true;
            }

            squares.push(square);
        }

        // apply or remove appropriate highlighting
        squares.forEach((square) => {
            if (!square.dataset.cell.includes('ship')) {
                square.style.backgroundColor = isMouseOut
                    ? null
                    : isInBounds && !willCollide
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

        const btnsToDisable = document.querySelectorAll<HTMLButtonElement>(
            '.ships button:not(#delete)'
        );
        btnsToDisable.forEach((btn) => {
            btn.disabled = !btn.disabled;
            btn.classList.toggle('disable');
        });
    }
}
