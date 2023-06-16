export class Ship {
    constructor(coordinates) {
        this.coordinates = coordinates;
        this.name = Ship.shipName(this.coordinates.length);
    }

    hit(y, x) {
        const i = this.coordinates.findIndex(([a, b]) => a === y && b === x);
        this.coordinates[i] = ['X', 'X'];
    }

    isSunk() {
        return this.coordinates.every(([a, b]) => a === 'X' && b === 'X');
    }

    static shipName(length) {
        switch (length) {
            case 5:
                return 'Zhanxian';
            case 4:
                return 'Haihu';
            case 3:
                return 'Mengchong';
            case 2:
                return 'Yuting';
        }
    }
}