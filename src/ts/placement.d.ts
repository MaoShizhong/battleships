export declare class Placement {
    static inDeleteMode: boolean;
    static currentShipOrientation: string;
    static currentShipSize: number;
    static changeShipSize(e: Event): void;
    static changeDirection(): void;
    static handleHighlightSquares(e: Event, isMouseOut: boolean): void;
    static applyBackgroundToAdjacentSquares(board: HTMLElement, square: HTMLElement, squaresToEdge: number, isMouseOut: boolean, isInBounds: boolean, willCollide: boolean): void;
    static get nextSquareOffset(): number;
    static getSquaresToEdge(square: HTMLElement): number;
    static placeShip(e: Event): void;
    static toggleDeleteMode(): void;
}
