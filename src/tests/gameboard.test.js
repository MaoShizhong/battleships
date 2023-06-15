import { Gameboard } from '../js/gameboard.js';
import { Ship } from '../js/ship.js';

describe('Initialise gameboard as 2D array of false (no ships)', () => {
    const fiveByfive = [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
    ];
    const fourBySeven = [
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
    ];
    const gameboards = [
        ['5x5', new Gameboard(5, 5), fiveByfive],
        ['4x7', new Gameboard(4, 7), fourBySeven],
    ];

    test.each(gameboards)(
        'Instantiates board with %s grid',
        (string, board, array) => expect(board.board).toEqual(array)
    );
});

describe('Identifies if empty board can fit ship of a given size from a given square', () => {
    const board = new Gameboard(10, 10);

    it('Correctly identifies 5-long horizontal ship can fit', () => {
        expect(board.canFitShip(new Ship(5), [0, 0])).toBe(true);
    });
    it('Correctly identifies 4-long vertical ship can fit', () => {
        expect(board.canFitShip(new Ship(4, null, 'vertical'), [6, 9])).toBe(true);
    });
    it('Correctly identifies 2-long horizontal ship will not fit', () => {
        expect(board.canFitShip(new Ship(2), [2, 9])).toBe(false);
    });
});

describe('Identifies if occupied board can fit ship of a given size from a given square', () => {
    const board = new Gameboard(10, 10);
    board.placeShip(new Ship(3), [0, 7]);
    board.placeShip(new Ship(5), [7, 1]);

    it('Accepts horizontal placement if ship would not intersect with an existing ship', () => {
        expect(board.canFitShip(new Ship(2), [0, 5])).toBe(true);
    });
    it('Rejects horizontal placement if ship would intersect with an existing ship', () => {
        expect(board.canFitShip(new Ship(2), [7, 0])).toBe(false);
    });
    it('Accepts vertical placement if ship would not intersect with an existing ship', () => {
        expect(board.canFitShip(new Ship(4, null, 'vertical'), [3, 3])).toBe(true);
    });
    it('Rejects vertical placement if ship would intersect with an existing ship', () => {
        expect(board.canFitShip(new Ship(5, null, 'vertical'), [3, 3])).toBe(false);
    });
});

describe('Places ship on board', () => {
    const horizontalFiveByFive = [
        [false, false, true, true, true],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
    ];
    const verticalFiveByFive = [
        [false, false, false, false, false],
        [false, true, false, false, false],
        [false, true, false, false, false],
        [false, true, false, false, false],
        [false, true, false, false, false],
    ];

    function getBoardAfterPlace(ship, coordinate) {
        const board = new Gameboard(5, 5);
        board.placeShip(ship, coordinate);

        return board.board;
    }

    it('Correctly places 3-long horizontal ship', () => {
        expect(getBoardAfterPlace(new Ship(3), [0, 2])).toEqual(horizontalFiveByFive);
    });
    it('Correctly places 4-long vertical ship', () => {
        expect(getBoardAfterPlace(new Ship(4, null, 'vertical'), [1, 1])).toEqual(verticalFiveByFive);
    });
});