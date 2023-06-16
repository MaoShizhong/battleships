export class UI {
    static loadBoardCells(board, rows, columns) {
        for (let i = 1; i < rows * columns + 1; i++) {
            const square = document.createElement('div');
            square.classList.add('cell');
            square.id = i;
            board.appendChild(square);
        }
    }
}