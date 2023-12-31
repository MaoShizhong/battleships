import { UI } from './ui_controller';
import { Player } from './player';

export class Animator {
    static RESULT_DURATION = 1700;
    static CANNONBALL_DURATION = 1000;

    static createCannonball(attackRecipient: Player): HTMLDivElement {
        const ball = document.createElement('div');
        UI.addClasses([ball], 'ball');

        // so attack comes from the attacker's side
        const leftOffset = attackRecipient.isAI ? 10 : 55;
        ball.style.left = `${Math.floor(Math.random() * 35) + leftOffset}%`;

        return ball;
    }

    static fireCannonball(
        attackRecipient: Player,
        targetBoard: HTMLDivElement,
        targetY: number,
        targetX: number
    ): void {
        const ball = Animator.createCannonball(attackRecipient);
        document.querySelector('body').appendChild(ball);

        const squarePos = Animator.getSquarePosition(targetBoard, targetY, targetX);

        ball.animate(
            [
                {
                    height: '1rem',
                    width: '1rem',
                    top: `${squarePos.top}%`,
                    left: `${squarePos.left}%`,
                },
            ],
            {
                duration: Animator.CANNONBALL_DURATION,
                easing: 'cubic-bezier(.88,-0.03,.82,.61)',
            }
        );
        setTimeout((): void => ball.remove(), Animator.CANNONBALL_DURATION);
    }

    static getSquarePosition(
        board: HTMLDivElement,
        y: number,
        x: number
    ): { top: number; left: number } {
        const square = board.querySelector(`[data-y="${y}"][data-x="${x}"]`);
        return {
            top: ((square.getBoundingClientRect().top + window.scrollY) / window.innerHeight) * 100,
            left:
                ((square.getBoundingClientRect().left + window.scrollX) / window.innerWidth) * 100,
        };
    }

    static showAttackText(attackedBoardParent: HTMLElement, result: string): void {
        const h1 = document.createElement('h1');
        h1.textContent = result;
        h1.style.top = `calc(${
            (attackedBoardParent.getBoundingClientRect().top / window.innerHeight) * 100
        }% - 1rem)`;
        UI.addClasses([h1], 'attack-result');

        attackedBoardParent.appendChild(h1);
        setTimeout((): void => h1.remove(), Animator.RESULT_DURATION);
    }
}
