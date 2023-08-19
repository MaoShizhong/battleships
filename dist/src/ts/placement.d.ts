export declare class Placement {
    static inDeleteMode: boolean;
    static currentShipOrientation: string;
    static currentShipSize: number;
    static changeShipSize(e: Event): void;
    static changeDirection(): void;
    static highlightSquares(e: Event): void;
    static removeHighlightOnMouseout(e: Event): void;
    static applyBackgroundToAdjacentSquares(board: HTMLElement, square: HTMLElement, squaresToEdge: number, mouseout: boolean, inBounds?: boolean): void;
    static getNextSquareOffset(): number;
    static getSquaresToEdge(square: HTMLElement): number;
    static placeShip(e: Event): void;
    static toggleDeleteMode(): void;
}
