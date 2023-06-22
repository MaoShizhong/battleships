import { Player } from './player';
import { Ship } from './ship';
import { UI } from './ui_controller';
import { Placement } from './placement.js';
import { Animator } from './animator';
import { game } from './index';

export class Gameboard {
    static HEIGHT = 10;
    static WIDTH = 10;

    constructor(isAI, selector) {
        this.UIBoard = document.querySelector(selector);
        this.player = new Player(isAI, selector);
        this.board = Array(Gameboard.HEIGHT).fill().map(() => Array(Gameboard.WIDTH).fill('none'));
        this.ships = [];
        this.shipLimits = {
            'Zhanxian': 1,
            'Haihu': 1,
            'Mengchong': 2,
            'Yuting': 3,
        };
    }

    canFitShip(y, x, size, orientation) {
        if (
            (orientation === 'horizontal' && x + size > Gameboard.WIDTH)
            || (orientation === 'vertical' && y + size > Gameboard.HEIGHT)
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
            Placement.toggleDeleteMode();

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

        UI.disableAllButtons(true);

        Animator.fireCannonball(this.player, this.UIBoard, y, x);

        setTimeout(() => {
            this.board[y][x] = this.board[y][x].includes('ship') ? `hits ${this.board[y][x].slice(5)}` : 'miss';

            if (this.board[y][x].includes('hits')) {
                this.hitShip(y, x);
            }
            else {
                Animator.showAttackText(this.UIBoard, 'Miss!');
            }

            UI.renderBoard(this.UIBoard, this.board, true);

            // ? UI.renderBoard creates new undisabled buttons
            // ? find a way to only need to call disable once
            // ? cannot call in UI.renderBoard due to initial load
            UI.disableAllButtons(true);

            // delay for hit/miss/sunk animation
            setTimeout(() => {
                if (!this.ships.length) {
                    return game.showWinner(game.activePlayer.player.name);
                }
                game.switchActivePlayer();
            }, Animator.RESULT_DURATION);
        }, Animator.CANNONBALL_DURATION);
    }

    hitShip(y, x) {
        const shipToHit = this.findShip(y, x);
        shipToHit.hit(y, x);

        if (shipToHit.isSunk()) {
            Animator.showAttackText(this.UIBoard, `${shipToHit.name} sunk!`);

            this.updateAIShipSunkStatus(shipToHit.coordinates);

            const i = this.ships.indexOf(shipToHit);
            this.ships.splice(i, 1);
        }
        else {
            Animator.showAttackText(this.UIBoard, 'Hit!');
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