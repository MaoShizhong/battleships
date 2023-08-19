import { Player } from './player';
export declare class Animator {
    static RESULT_DURATION: number;
    static CANNONBALL_DURATION: number;
    static createCannonball(attackRecipient: Player): HTMLDivElement;
    static fireCannonball(attackRecipient: Player, targetBoard: HTMLDivElement, targetY: number, targetX: number): void;
    static getSquarePosition(board: HTMLDivElement, y: number, x: number): {
        top: number;
        left: number;
    };
    static showAttackText(attackedBoardParent: HTMLElement, result: string): void;
}
