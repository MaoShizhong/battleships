export class Gameboard {
    // ? will change to undefined - will eventually be adjustable in UI
    // ? static currentShipSize = 5;

    constructor(height, width, shipCount = 5) {
        this.height = height;
        this.width = width;
        this.board = Array(height).fill().map(() => Array(width).fill(false));
        this.shipsRemaining = shipCount;
    }

    canFitShip(ship, coordinate) {
        if (ship.orientation === 'horizontal' && coordinate[1] + ship.length - 1 < this.width) {
            for (let i = 0, j = coordinate[1]; i < ship.length; i++, j++) {
                if (this.board[coordinate[0]][j] === true) return false;
            }
            return true;
        }
        else if (ship.orientation === 'vertical' && coordinate[0] + ship.length - 1 < this.height) {
            for (let i = 0, j = coordinate[0]; i < ship.length; i++, j++) {
                if (this.board[j][coordinate[1]] === true) return false;
            }
            return true;
        }
        return false;
    }

    placeShip(ship, coordinate) {
        if (ship.orientation === 'horizontal') {
            for (let i = 0, j = coordinate[1]; i < ship.length; i++, j++) {
                this.board[coordinate[0]][j] = true;
            }
        }
        else {
            for (let i = 0, j = coordinate[0]; i < ship.length; i++, j++) {
                this.board[j][coordinate[1]] = true;
            }
        }
    }
}