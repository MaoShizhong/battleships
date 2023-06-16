import { Player } from './player';
import { Ship } from './ship';

export class Gameboard {
    constructor(height, width, type = false, name = 'Foo') {
        this.player = new Player(type, name);
        this.height = height;
        this.width = width;
        this.board = Array(height).fill().map(() => Array(width).fill(false));
        this.ships = [];
        this.shipLimits = {
            'Zhanxian': 1,
            'Haihu': 1,
            'Mengchong': 2,
            'Yuting': 2,
        };
        this.currentShipSize = 5;
        this.currentShipOrientation = 'horizontal';

        // TODO: replace when game logic implemented
        this.isGameOver = false;
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
        if (this.noShipsOfType()) throw new Error('No more of those ships left to place!');
        else if (!this.canFitShip(y, x)) throw new Error('Ship will not fit');

        const shipCoordinates = [];
        for (let i = 0; i < this.currentShipSize; i++) {
            this.board[y][x] = true;
            shipCoordinates.push([y, x]);

            this.currentShipOrientation === 'vertical' ? y++ : x++;
        }

        this.ships.push(new Ship(shipCoordinates, this.currentShipOrientation));
        this.shipLimits[this.ships.at(-1).name]--;
    }

    changeShipOrientation() {
        this.currentShipOrientation = this.currentShipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    }

    receiveAttack(y, x) {
        if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
            throw new Error('This square is out of bounds!');
        }
        if (typeof this.board[y][x] !== 'boolean') {
            throw new Error('You have already targeted this square before! Please pick another square.');
        }

        this.board[y][x] = this.board[y][x] ? 'hit' : 'miss';

        if (this.board[y][x] === 'hit') {
            this.hitShip(y, x);
        }
        // TODO: Game over logic - complete when GameController class implemented
        if (!this.ships.length) {
            this.isGameOver = true;
        }
    }

    hitShip(y, x) {
        const shipToHit = this.ships.find(ship => ship.coordinates.find(([a, b]) => a === y && b === x));
        shipToHit.hit(y, x);

        if (shipToHit.isSunk()) {
            const i = this.ships.indexOf(shipToHit);
            this.ships.splice(i, 1);
        }
    }

    noShipsOfType() {
        return this.shipLimits[Ship.shipName(this.currentShipSize)] === 0;
    }
}