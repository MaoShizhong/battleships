export class Ship {
    constructor(length, testArray, orientation = 'horizontal') {
        this.length = length;
        this.coordinates = testArray ? testArray : Array(length).fill().map(() => Array(2));
        this.orientation = orientation;
    }

    hit(coords) {
        const i = this.coordinates.findIndex(([a, b]) => {
            return a === coords[0] && b === coords[1];
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