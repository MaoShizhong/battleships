import '../css/style.css';
import '../css/ship_borders.css';
import { Game } from './game_controller';
import { Placement } from './placement.js';
import { UI } from './ui_controller';

const placementBoard = document.querySelector('.board.placement');
const deleteBtn = document.querySelector('#delete');
const rotateBtn = document.querySelector('#rotate');
const shipBtns = document.querySelectorAll('.ship-placement > button');

// * initialise
export let game = new Game(false, true);

deleteBtn.addEventListener('click', (deleteBtn) => Placement.toggleDeleteMode(deleteBtn));
rotateBtn.addEventListener('click', () => Placement.changeDirection());
shipBtns.forEach(btn => btn.addEventListener('click', () => Placement.changeShipSize(btn)));
placementBoard.addEventListener('mouseover', (e) => Placement.highlightSquares(e));
placementBoard.addEventListener('mouseout', (e) => Placement.removeHighlightOnMouseout(e));
placementBoard.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const y = +e.target.dataset.y;
        const x = +e.target.dataset.x;

        if (Placement.inDeleteMode) game.playerOne.deleteShip(y, x);
        else game.playerOne.placeShip(y, x);
    };
});