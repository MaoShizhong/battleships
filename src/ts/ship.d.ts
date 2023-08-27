export type Coordinate = [number, number, string?];
export declare class Ship {
    coordinates: Coordinate[];
    name: string;
    constructor(coordinates: Coordinate[]);
    hit(y: number, x: number): void;
    get isSunk(): boolean;
    static shipName(length: number): string;
}
