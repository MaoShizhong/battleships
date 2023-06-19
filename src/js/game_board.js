import { Player } from './player';
import { Ship } from './ship';
import { UI } from './ui_controller';
import { Placement } from './placement.js';

export class Gameboard {
    static height = 10;
    static width = 10;

    constructor(IDselector, isAI) {
        this.UIBoard = document.querySelector(IDselector);
        this.player = new Player(isAI);
        this.board = Array(Gameboard.height).fill().map(() => Array(Gameboard.width).fill('none'));
        this.ships = [];
        this.shipLimits = {
            'Zhanxian': 1,
            'Haihu': 1,
            'Mengchong': 2,
            'Yuting': 2,
        };

        // TODO: replace when game logic implemented
        this.isGameOver = false;
    }

    canFitShip(y, x, size, orientation) {
        if (
            (orientation === 'horizontal' && x + size > Gameboard.width)
            || (orientation === 'vertical' && y + size > Gameboard.height)
        ) return false;

        for (let i = 0; i < size; i++) {
            if (this.board[y][x].includes('ship')) return false;

            orientation === 'vertical' ? y++ : x++;
        }
        return true;
    }

    placeShip(y, x, size = Placement.currentShipSize, orientation = Placement.currentShipOrientation) {
        if (this.shipsOfTypeRemaining(size) && this.canFitShip(y, x, size, orientation)) {
            const shipCoordinates = [];

            for (let i = 0; i < size; i++) {
                const position = i === 0 ? 'head' : i === size - 1 ? 'end' : 'middle';

                this.board[y][x] = `ship ${position} ${orientation}`;
                shipCoordinates.push([y, x]);

                orientation === 'vertical' ? y++ : x++;
            }

            this.ships.push(new Ship(shipCoordinates, orientation));
            this.reduceShipCount(this.ships.at(-1).name);

            if (!this.player.isAI) {
                UI.renderBoard(this.UIBoard, this.board, false);

                if (this.allShipsPlaced()) UI.showGameStartBtn();
            }
        }
    }

    deleteShip(y, x) {
        const ship = this.findShip(y, x);
        if (ship) {
            ship.coordinates.forEach(coordinate => {
                this.board[coordinate[0]][coordinate[1]] = 'none';
            });

            this.increaseShipCount(ship.name, ship.coordinates.length);
            this.ships.splice(this.ships.indexOf(ship), 1);

            UI.renderBoard(this.UIBoard, this.board, this.player.isAI);

            const startBtn = document.querySelector('#start-game');
            if (startBtn) startBtn.remove();
        }
    }

    reduceShipCount(shipName) {
        this.shipLimits[shipName]--;
        if (!this.player.isAI) UI.reduceShipCount(shipName, this.shipLimits[shipName]);
    }

    increaseShipCount(shipName, shipSize) {
        this.shipLimits[shipName]++;
        UI.increaseShipCount(shipName, shipSize, this.shipLimits[shipName]);
    }

    receiveAttack(y, x) {
        if (this.board[y][x].includes('hits') || this.board[y][x] === 'miss') {
            return alert('You have already targeted this square!\nPlease pick another.');
        }

        this.board[y][x] = this.board[y][x].includes('ship') ? `hits ${this.board[y][x].slice(5)}` : 'miss';

        if (this.board[y][x].includes('hits')) {
            this.hitShip(y, x);
        }

        UI.renderBoard(this.UIBoard, this.board, true);

        // TODO: Game over logic - complete when GameController class implemented
        if (!this.ships.length) {
            this.isGameOver = true;
        }
    }

    hitShip(y, x) {
        const shipToHit = this.findShip(y, x);
        shipToHit.hit(y, x);

        if (shipToHit.isSunk()) {
            if (this.player.isAI) {
                alert(`You sunk a ${Ship.shipName(shipToHit.coordinates.length)}!`);
                this.updateAIShipSunkStatus(shipToHit.coordinates);
            }

            const i = this.ships.indexOf(shipToHit);
            this.ships.splice(i, 1);
        }
    }

    updateAIShipSunkStatus(coordinates) {
        coordinates.forEach(coordinate => this.board[coordinate[0]][coordinate[1]] += ' sunk');
    }

    allShipsPlaced() {
        return Object.values(this.shipLimits).every(count => count == 0);
    }

    shipsOfTypeRemaining(size) {
        return this.shipLimits[Ship.shipName(size)];
    }

    findShip(y, x) {
        return this.ships.find(ship => ship.coordinates.find(([a, b]) => a === y && b === x));
    }

    generateAIBoard() {
        if (this.player.isAI) {
            while (!this.allShipsPlaced()) {
                const y = Math.floor(Math.random() * 10);
                const x = Math.floor(Math.random() * 10);
                const size = Math.floor(Math.random() * 4) + 2;
                const orientation = ['horizontal', 'vertical'][Math.floor(Math.random() * 2)];

                this.placeShip(y, x, size, orientation);
            }
        }
    }
}