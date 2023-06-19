import '../css/style.css';
import '../css/ship_data.css';
import { Game } from './game_controller';
import { Placement } from './placement.js';

const placementBoard = document.querySelector('.board.placement');
const deleteBtn = document.querySelector('#delete');
const rotateBtn = document.querySelector('#rotate');
const shipBtns = document.querySelectorAll('.ship-placement > button');

// * initialise
export let game = new Game();

deleteBtn.addEventListener('click', (deleteBtn) => Placement.toggleDeleteMode(deleteBtn));
rotateBtn.addEventListener('click', () => Placement.changeDirection());
shipBtns.forEach(btn => btn.addEventListener('click', () => Placement.changeShipSize(btn)));
placementBoard.addEventListener('mouseover', Placement.highlightSquares);
placementBoard.addEventListener('mouseout', Placement.removeHighlightOnMouseout);
placementBoard.addEventListener('click', placeShip);


export function placeShip(e) {
    if (e.target.tagName === 'BUTTON') {
        const y = +e.target.dataset.y;
        const x = +e.target.dataset.x;

        if (Placement.inDeleteMode) game.playerOne.deleteShip(y, x);
        else game.playerOne.placeShip(y, x);
    };
}