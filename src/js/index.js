import '../css/style.css';
import { Gameboard } from './game_board';
import { UI } from './ui_controller';

const placementBoard = document.querySelector('.board.placement');
const rotateBtn = document.querySelector('#rotate');

// * initialise
const boardOne = new Gameboard(10, 10, false);
const boardTwo = new Gameboard(10, 10, false);
UI.loadBoardCells(placementBoard, boardOne.width, boardOne.height);

rotateBtn.addEventListener('click', () => boardOne.changeShipOrientation());

// TODO: REFACTOR THIS LATER
placementBoard.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('cell')) {
        let cell = e.target;
        const cellsToEdge = getCellsToEdge(+cell.id, boardOne.currentShipOrientation);
        const isInBounds = boardOne.currentShipSize <= cellsToEdge;

        cell.style.backgroundColor = isInBounds ? '#AA381E' : '#B4B4B4';

        for (let i = 1; i < Math.min(boardOne.currentShipSize, cellsToEdge); i++) {
            const cellShift = boardOne.currentShipOrientation === 'horizontal' ? 1 : boardOne.width;
            for (let j = 0; j < cellShift; j++) {
                cell = cell.nextElementSibling;
            }
            cell.style.backgroundColor = isInBounds ? '#AA381E' : '#B4B4B4';
        }
    }
});
placementBoard.addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('cell')) {
        let cell = e.target;
        cell.style.backgroundColor = null;
        const cellsToEdge = getCellsToEdge(+cell.id, boardOne.currentShipOrientation);

        for (let i = 1; i < Math.min(boardOne.currentShipSize, cellsToEdge); i++) {
            const cellShift = boardOne.currentShipOrientation === 'horizontal' ? 1 : boardOne.width;
            for (let j = 0; j < cellShift; j++) {
                cell = cell.nextElementSibling;
            }
            cell.style.backgroundColor = null;
        }
    }
});

function getCellsToEdge(currentCell, orientation) {
    if (orientation === 'horizontal') {
        return boardOne.width - ((currentCell % boardOne.width) || 10) + 1;
    }
    return boardOne.height - ((Math.ceil(currentCell / 10) % boardOne.height) || 10) + 1;
}