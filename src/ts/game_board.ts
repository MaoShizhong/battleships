import { Animator } from './animator';
import { game } from './index';
import { Placement } from './placement';
import { Player } from './player';
import { Coordinate, Ship } from './ship';
import { UI } from './ui_controller';

interface ShipLimits {
    [index: string]: number;
}

export class Gameboard {
    UIBoard: HTMLDivElement;
    player: Player;
    board: string[][];
    ships: Ship[];
    shipLimits: ShipLimits;

    static #HEIGHT = 10;
    static #WIDTH = 10;

    static get HEIGHT() {
        return Gameboard.#HEIGHT;
    }

    static get WIDTH() {
        return Gameboard.#WIDTH;
    }

    constructor(isAI: boolean, selector: string) {
        this.UIBoard = document.querySelector(selector);
        this.player = new Player(isAI, selector);
        this.board = Array.from({ length: Gameboard.HEIGHT }, (): string[] =>
            Array(Gameboard.WIDTH).fill('none')
        );
        this.ships = [];
        this.shipLimits = {
            Zhanxian: 1,
            Haihu: 1,
            Mengchong: 2,
            Yuting: 3,
        };
    }

    canFitShip(y: number, x: number, shipSize: number, orientation: string): boolean {
        const inBounds =
            (orientation === 'vertical' && y + shipSize <= Gameboard.HEIGHT) ||
            (orientation === 'horizontal' && x + shipSize <= Gameboard.WIDTH);

        if (!inBounds) {
            return false;
        }

        for (let i = 0; i < shipSize; i++) {
            if (this.board[y][x].includes('ship')) {
                return false;
            }

            orientation === 'vertical' ? y++ : x++;
        }

        return true;
    }

    placeShip(
        y: number,
        x: number,
        size: number = Placement.currentShipSize,
        orientation: string = Placement.currentShipOrientation
    ): void {
        if (!this.shipsOfTypeRemaining(size) || !this.canFitShip(y, x, size, orientation)) {
            return;
        }

        const shipCoordinates: Coordinate[] = [];

        for (let i = 0; i < size; i++) {
            const position = i === 0 ? 'head' : i === size - 1 ? 'end' : 'middle';

            this.board[y][x] = `ship ${position} ${orientation}`;
            shipCoordinates.push([y, x]);

            orientation === 'vertical' ? y++ : x++;
        }

        this.ships.push(new Ship(shipCoordinates));
        this.reduceShipCount(this.ships.at(-1).name);

        if (!this.player.isAI) {
            this.renderPlacement();
        }
    }

    renderPlacement(): void {
        UI.renderBoard(this.UIBoard, this.board, false);

        if (this.allShipsPlaced()) {
            UI.showGameStartBtn();
        }
    }

    deleteShip(y: number, x: number): void {
        const ship = this.findShip(y, x);

        if (ship) {
            ship.coordinates.forEach((coordinate) => {
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

    reduceShipCount(shipName: string): void {
        this.shipLimits[shipName]--;
        if (!this.player.isAI) UI.reduceShipCount(shipName, this.shipLimits[shipName]);
    }

    increaseShipCount(shipName: string, shipSize: number): void {
        this.shipLimits[shipName]++;
        UI.increaseShipCount(shipName, shipSize, this.shipLimits[shipName]);
    }

    receiveAttack(y: number, x: number): void {
        if (this.board[y][x].includes('hits') || this.board[y][x] === 'miss') {
            return alert('You have already targeted this square!\nPlease pick another.');
        }

        UI.disableAllButtons(true);

        Animator.fireCannonball(this.player, this.UIBoard, y, x);

        setTimeout(
            (): void => this.executeAttackAfterAnimationDelay(y, x),
            Animator.CANNONBALL_DURATION
        );
    }

    executeAttackAfterAnimationDelay(y: number, x: number): void {
        this.board[y][x] = this.board[y][x].includes('ship')
            ? `hits ${this.board[y][x].slice(5)}`
            : 'miss';

        if (this.board[y][x].includes('hits')) {
            this.hitShip(y, x);
        } else {
            Animator.showAttackText(this.UIBoard.parentElement, 'Miss!');
        }

        UI.renderBoard(this.UIBoard, this.board, this.player.isAI);

        // ? UI.renderBoard creates new undisabled buttons
        // ? find a way to only need to call disable once
        // ? cannot call in UI.renderBoard due to initial load
        UI.disableAllButtons(true);

        // delay for hit/miss/sunk animation
        setTimeout((): void => {
            if (!this.ships.length) {
                return game.showWinner(game.activePlayer.player.name);
            }
            game.switchActivePlayer();
        }, Animator.RESULT_DURATION);
    }

    hitShip(y: number, x: number): void {
        const shipToHit = this.findShip(y, x);
        shipToHit.hit(y, x);

        if (shipToHit.isSunk) {
            Animator.showAttackText(this.UIBoard.parentElement, `${shipToHit.name} sunk!`);

            this.updateAIShipSunkStatus(shipToHit.coordinates);

            const i = this.ships.indexOf(shipToHit);
            this.ships.splice(i, 1);
        } else {
            Animator.showAttackText(this.UIBoard.parentElement, 'Hit!');
        }
    }

    updateAIShipSunkStatus(coordinates: Coordinate[]): void {
        coordinates.forEach(
            (coordinate): string => (this.board[coordinate[0]][coordinate[1]] += ' sunk')
        );
    }

    allShipsPlaced(): boolean {
        return Object.values(this.shipLimits).every((count) => count == 0);
    }

    shipsOfTypeRemaining(size: number): number {
        return this.shipLimits[Ship.shipName(size)];
    }

    findShip(y: number, x: number): Ship {
        return this.ships.find(
            (ship): Coordinate => ship.coordinates.find(([a, b]) => a === y && b === x)
        );
    }

    generateAIBoard(): void {
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
