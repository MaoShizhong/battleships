import { UI } from './ui_controller';

export class Animator {
    static RESULT_DURATION = 1700;
    static CANNONBALL_DURATION = 1000;

    static createCannonball(attackRecipient) {
        const ball = document.createElement('div');
        UI.addClasses([ball], 'ball');

        // so attack comes from the attacker's side
        const leftOffset = attackRecipient.isAI ? 10 : 55;
        ball.style.left = `${Math.floor(Math.random() * 35) + leftOffset}%`;
        return ball;
    }

    static fireCannonball(attackRecipient, targetBoard, targetY, targetX) {
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
        setTimeout(() => ball.remove(), Animator.CANNONBALL_DURATION);
    }

    static getSquarePosition(board, y, x) {
        const square = board.querySelector(`[data-y="${y}"][data-x="${x}"]`);
        return {
            top: (square.getBoundingClientRect().top + window.scrollY) / window.innerHeight * 100,
            left: (square.getBoundingClientRect().left + window.scrollX) / window.innerWidth * 100,
        };
    }

    static showAttackText(attackedBoard, result) {
        const h1 = document.createElement('h1');
        h1.textContent = result;
        h1.style.top =
            `calc(${(attackedBoard.parentNode.getBoundingClientRect().top) / window.innerHeight * 100}% - 1rem)`;
        UI.addClasses([h1], 'attack-result');

        attackedBoard.parentNode.appendChild(h1);
        setTimeout(() => h1.remove(), Animator.RESULT_DURATION);
    }
}