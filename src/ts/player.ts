import { Gameboard } from './game_board';

export class Player {
    isAI: boolean;
    selector: string;
    name: string;
    remainingAttacks: number[][];

    constructor(isAI: boolean, selector: string) {
        this.isAI = isAI;
        this.selector = selector;
        this.name = this.isAI ? 'CPU' : 'You';
        this.remainingAttacks = this.getAllPossibleAttacks();
    }

    attackOpponent(opponentBoard: Gameboard): void {
        const hitNotSunk = opponentBoard.board.some((row) =>
            row.some((str) => /^hits(?!.*sunk$)/.test(str))
        );

        if (hitNotSunk) this.honeInAttack(opponentBoard);
        else this.sendRandomAttack(opponentBoard);
    }

    sendRandomAttack(opponent: Gameboard): void {
        const randomIndex = ~~(Math.random() * this.remainingAttacks.length);

        const attack = this.remainingAttacks[randomIndex];

        opponent.receiveAttack(attack[0], attack[1]);

        this.removeAttackFromRemainingAttacks(attack);
    }

    honeInAttack(opponent: Gameboard): void {
        const squares: NodeListOf<HTMLElement> = document.querySelectorAll(
            `${opponent.player.selector} > button`
        );
        const squaresHitNotSunk: HTMLElement[] = [...squares].filter((square: HTMLElement) =>
            /^hits(?!.*sunk$)/.test(square.dataset.cell)
        );

        // prevents selecting squares with no legal surrounding moves (e.g. unsunk corners)
        let squareHitNotSunk: HTMLElement, y: number, x: number, attackOptions: number[][];

        do {
            squareHitNotSunk = squaresHitNotSunk[~~(Math.random() * squaresHitNotSunk.length)];

            y = +squareHitNotSunk.dataset.y;
            x = +squareHitNotSunk.dataset.x;

            attackOptions = this.getHoneAttackOptions(y, x);
        } while (!attackOptions.length);

        // variance, not fixed starting from upper left corner
        const attack = attackOptions[~~(Math.random() * attackOptions.length)];

        this.removeAttackFromRemainingAttacks([attack[0], attack[1]]);
        return opponent.receiveAttack(attack[0], attack[1]);
    }

    removeAttackFromRemainingAttacks(attackSent: number[]): void {
        const indexOfAttack = this.remainingAttacks.findIndex(
            (attack) => attack[0] === attackSent[0] && attack[1] === attackSent[1]
        );
        this.remainingAttacks.splice(indexOfAttack, 1);
    }

    getAllPossibleAttacks(): number[][] {
        const possibleAttacks: number[][] = [];

        for (let i = 0; i < Gameboard.HEIGHT; i++) {
            for (let j = 0; j < Gameboard.WIDTH; j++) {
                possibleAttacks.push([i, j]);
            }
        }

        return possibleAttacks;
    }

    getHoneAttackOptions(y: number, x: number): number[][] {
        const options: number[][] = [];

        for (let i = y - 1; i <= y + 1; i++) {
            for (let j = x - 1; j <= x + 1; j++) {
                const inBounds = i >= 0 && i < Gameboard.HEIGHT && j >= 0 && j < Gameboard.WIDTH;
                const isOrthogonal =
                    (i === y && (j === x - 1 || j === x + 1)) ||
                    (j === x && (i === y - 1 || i === y + 1));
                const isAlreadyAttacked = !this.remainingAttacks.some(
                    (el) => el[0] === i && el[1] === j
                );

                if (inBounds && isOrthogonal && !isAlreadyAttacked) {
                    options.push([i, j]);
                }
            }
        }

        return options;
    }
}
