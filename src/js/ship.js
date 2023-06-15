export class Ship {
    constructor(coordinates, orientation) {
        this.coordinates = coordinates;
        this.orientation = orientation;
        this.length = this.coordinates.length;
    }

    hit(y, x) {
        const i = this.coordinates.findIndex(([a, b]) => {
            return a === y && b === x;
        });
        this.coordinates[i] = ['X', 'X'];
    }

    isSunk() {
        return this.coordinates.every(([a, b]) => a === 'X' && b === 'X');
    }

    changeOrientation() {
        this.orientation = this.orientation === 'horizontal' ? 'vertical' : 'horizontal';
    }
}