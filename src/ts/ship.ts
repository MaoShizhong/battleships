export class Ship {
    coordinates: (string | number)[][];
    name: string;

    constructor(coordinates: number[][]) {
        this.coordinates = coordinates;
        this.name = Ship.shipName(this.coordinates.length);
    }

    hit(y: number, x: number): void {
        const i: number = this.coordinates.findIndex(([a, b]) => a === y && b === x);
        this.coordinates[i].push('hit');
    }

    get isSunk(): boolean {
        return this.coordinates.every((coordinate: number[]) => coordinate.length === 3);
    }

    static shipName(length: number): string {
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
