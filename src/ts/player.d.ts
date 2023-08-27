import { Gameboard } from './game_board';
export declare class Player {
    isAI: boolean;
    selector: string;
    name: string;
    remainingAttacks: number[][];
    constructor(isAI: boolean, selector: string);
    attackOpponent(opponentBoard: Gameboard): void;
    sendRandomAttack(opponent: Gameboard): void;
    honeInAttack(opponent: Gameboard): void;
    removeAttackFromRemainingAttacks(attackSent: number[]): void;
    getAllPossibleAttacks(): number[][];
    getHoneAttackOptions(y: number, x: number): number[][];
}
