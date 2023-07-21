import { Gameboard } from './game_board';

export class Player {
    isAI: boolean;
    selector: string;
    name: string;
    attacksSent: number[][];

    constructor(isAI: boolean, selector: string) {
        this.isAI = isAI;
        this.selector = selector;
        this.name = this.isAI ? 'CPU' : 'You';
        this.attacksSent = [];
    }

    attackOpponent(opponentBoard: Gameboard): void {
        const hitNotSunk = opponentBoard.board.some((row) =>
            row.some((str) => /^hits(?!.*sunk$)/.test(str))
        );

        if (hitNotSunk) this.honeInAttack(opponentBoard);
        else this.sendRandomAttack(opponentBoard);
    }

    sendRandomAttack(opponent: Gameboard): void {
        let y: number, x: number;
        do {
            y = Math.floor(Math.random() * Gameboard.HEIGHT);
            x = Math.floor(Math.random() * Gameboard.WIDTH);
        } while (this.attacksSent.some((coordinate) => coordinate[0] === y && coordinate[1] === x));

        opponent.receiveAttack(y, x);

        this.attacksSent.push([y, x]);
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
            squareHitNotSunk =
                squaresHitNotSunk[Math.floor(Math.random() * squaresHitNotSunk.length)];
            y = +squareHitNotSunk.dataset.y;
            x = +squareHitNotSunk.dataset.x;
            attackOptions = this.getAttackOptions(y, x);
        } while (!attackOptions.length);

        // variance, not fixed starting from upper left corner
        const attack = attackOptions[Math.floor(Math.random() * attackOptions.length)];

        this.attacksSent.push([attack[0], attack[1]]);
        return opponent.receiveAttack(attack[0], attack[1]);
    }

    getAttackOptions(y: number, x: number): number[][] {
        const options: number[][] = [];

        for (let i = y - 1; i <= y + 1; i++) {
            for (let j = x - 1; j <= x + 1; j++) {
                const inBounds = i >= 0 && i < Gameboard.HEIGHT && j >= 0 && j < Gameboard.WIDTH;
                const isOrthogonal =
                    (i === y && (j === x - 1 || j === x + 1)) ||
                    (j === x && (i === y - 1 || i === y + 1));
                const isAlreadyAttacked = this.attacksSent.some((el) => el[0] === i && el[1] === j);

                if (inBounds && isOrthogonal && !isAlreadyAttacked) {
                    options.push([i, j]);
                }
            }
        }

        return options;
    }
}
