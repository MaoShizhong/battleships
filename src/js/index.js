import '../css/style.css';
import '../css/ship_data.css';
import cssHasPseudo from 'css-has-pseudo/browser';
import { Game } from './game_controller';
import { Placement } from './placement.js';

// Firefox :has() compatibility
cssHasPseudo(document, { hover: true });

const placementBoard = document.querySelector('.board.placement');
const deleteBtn = document.querySelector('#delete');
const rotateBtn = document.querySelector('#rotate');
const shipBtns = document.querySelectorAll('.ship-placement > button');

// initialise
export let game = new Game();

deleteBtn.addEventListener('click', Placement.toggleDeleteMode);
rotateBtn.addEventListener('click', Placement.changeDirection);
shipBtns.forEach((btn) => btn.addEventListener('click', Placement.changeShipSize));
placementBoard.addEventListener('mouseover', Placement.highlightSquares);
placementBoard.addEventListener('mouseout', Placement.removeHighlightOnMouseout);
placementBoard.addEventListener('click', Placement.placeShip);
