import { Gameboard } from './game_board';

export class Player {
    constructor(isAI, selector) {
        this.isAI = isAI;
        this.selector = selector;
        this.name = this.isAI ? 'CPU' : 'You';
        this.attacksSent = [];
    }

    attackOpponent(opponent) {
        const hitNotSunk = opponent.board.some(row => row.some(str => /^hits(?!.*sunk$)/.test(str)));

        if (hitNotSunk) this.honeInAttack(opponent);
        else this.randomAttack(opponent);
    }

    randomAttack(opponent) {
        let y, x;
        do {
            y = Math.floor(Math.random() * Gameboard.HEIGHT);
            x = Math.floor(Math.random() * Gameboard.WIDTH);
        } while (this.attacksSent.some(coordinate => coordinate[0] === y && coordinate[1] === x));

        opponent.receiveAttack(y, x);
        this.attacksSent.push([y, x]);
    }

    honeInAttack(opponent) {
        const squares = document.querySelectorAll(`${opponent.player.selector} > button`);
        const squaresHitNotSunk = [...squares].filter(square => square.dataset.cell === 'hits');

        // prevents selecting squares with no legal surrounding moves (e.g. unsunk corners)
        let squareHitNotSunk, y, x, attackOptions;
        do {
            squareHitNotSunk = squaresHitNotSunk[Math.floor(Math.random() * squaresHitNotSunk.length)];
            y = +squareHitNotSunk.dataset.y;
            x = +squareHitNotSunk.dataset.x;
            attackOptions = this.getAttackOptions(y, x);
        } while (!attackOptions.length);

        // variance, not fixed starting from upper left corner
        const attack = attackOptions[Math.floor(Math.random() * attackOptions.length)];

        this.attacksSent.push([attack[0], attack[1]]);
        return opponent.receiveAttack(attack[0], attack[1]);
    }

    getAttackOptions(y, x) {
        const options = [];

        for (let i = y - 1; i <= y + 1; i++) {
            for (let j = x - 1; j <= x + 1; j++) {
                const inBounds = i >= 0 && i < Gameboard.HEIGHT && j >= 0 && j < Gameboard.WIDTH;
                const isOrthogonal = (i === y && (j === x - 1 || j === x + 1)) || (j === x && (i === y - 1 || i === y + 1));
                const isAlreadyAttacked = this.attacksSent.some(el => el[0] === i && el[1] === j);

                if (inBounds && isOrthogonal && !isAlreadyAttacked) options.push([i, j]);
            }
        }
        return options;
    }
}