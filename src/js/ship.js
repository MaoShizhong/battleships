export class Ship {
    constructor(coordinates) {
        this.coordinates = coordinates;
        this.length = this.coordinates.length;
    }

    hit(y, x) {
        const i = this.coordinates.findIndex(([a, b]) => a === y && b === x);
        this.coordinates[i] = ['X', 'X'];
    }

    isSunk() {
        return this.coordinates.every(([a, b]) => a === 'X' && b === 'X');
    }
}