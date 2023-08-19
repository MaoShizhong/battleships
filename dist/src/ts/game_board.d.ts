import { Player } from './player';
import { Ship } from './ship';
import { Coordinate } from './ship';
interface ShipLimits {
    [index: string]: number;
}
export declare class Gameboard {
    #private;
    UIBoard: HTMLDivElement;
    player: Player;
    board: string[][];
    ships: Ship[];
    shipLimits: ShipLimits;
    static get HEIGHT(): number;
    static get WIDTH(): number;
    constructor(isAI: boolean, selector: string);
    canFitShip(y: number, x: number, shipSize: number, orientation: string): boolean;
    placeShip(y: number, x: number, size?: number, orientation?: string): void;
    renderPlacement(): void;
    deleteShip(y: number, x: number): void;
    reduceShipCount(shipName: string): void;
    increaseShipCount(shipName: string, shipSize: number): void;
    receiveAttack(y: number, x: number): void;
    executeAttackAfterAnimationDelay(y: number, x: number): void;
    hitShip(y: number, x: number): void;
    updateAIShipSunkStatus(coordinates: Coordinate[]): void;
    allShipsPlaced(): boolean;
    shipsOfTypeRemaining(size: number): number;
    findShip(y: number, x: number): Ship;
    generateAIBoard(): void;
}
export {};
