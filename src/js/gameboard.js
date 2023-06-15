import { Player } from './player';
import { Ship } from './ship';

export class Gameboard {
    constructor(height, width, shipCount = 5) {
        this.player = new Player();
        this.height = height;
        this.width = width;
        this.board = Array(height).fill().map(() => Array(width).fill(false));
        this.ships = [];
        this.shipsRemaining = shipCount;
        this.currentShipSize = 5;
        this.currentShipOrientation = 'horizontal';
    }

    canFitShip(y, x) {
        if (
            (this.currentShipOrientation === 'horizontal' && x + this.currentShipSize > this.width)
            || (this.currentShipOrientation === 'vertical' && y + this.currentShipSize > this.height)
        ) return false;

        for (let i = 0; i < this.currentShipSize; i++) {
            if (this.board[y][x] === true) return false;

            this.currentShipOrientation === 'vertical' ? y++ : x++;
        }
        return true;
    }

    placeShip(y, x) {
        if (!this.shipsRemaining) throw new Error('No more ships left to place!');
        else if (!this.canFitShip(y, x)) throw new Error('Ship will not fit');

        const shipCoordinates = [];
        for (let i = 0; i < this.currentShipSize; i++) {
            this.board[y][x] = true;
            shipCoordinates.push([y, x]);

            this.currentShipOrientation === 'vertical' ? y++ : x++;
        }

        this.ships.push(new Ship(shipCoordinates, this.currentShipOrientation));
        this.shipsRemaining--;
    }

    changeShipOrientation() {
        this.currentShipOrientation = this.currentShipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    }
}