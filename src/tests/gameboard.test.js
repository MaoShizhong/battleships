import { Gameboard } from '../js/gameboard.js';

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

    function canFit(orientation, size, y, x) {
        board.currentShipOrientation = orientation;
        board.currentShipSize = size;
        return board.canFitShip(y, x);
    }

    it('Correctly identifies 5-long horizontal ship can fit', () => {
        expect(canFit('horizontal', 5, 0, 0)).toBe(true);
    });
    it('Correctly identifies 4-long vertical ship can fit', () => {
        expect(canFit('vertical', 4, 6, 9)).toBe(true);
    });
    it('Correctly identifies 2-long horizontal ship will not fit', () => {
        expect(canFit('horizontal', 2, 2, 9)).toBe(false);
    });
});

describe('Places ship on board if can fit', () => {
    const oneShip = [
        [false, false, true, true, true],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
    ];
    const twoShips = [
        [false, false, true, true, true],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
    ];
    const threeShips = [
        [false, false, true, true, true],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [true, true, true, false, false],
    ];

    const board = new Gameboard(5, 5);
    function getBoardAfterPlace(orientation, size, y, x) {
        board.currentShipOrientation = orientation;
        board.currentShipSize = size;
        board.placeShip(y, x);
        return board.board;
    }

    test('Should show board instance has no ships in it', () => {
        expect(board.ships.length).toBe(0);
    });
    it('Correctly places 3-long horizontal ship on board', () => {
        expect(getBoardAfterPlace('horizontal', 3, 0, 2)).toEqual(oneShip);
    });
    test('Should show board instance now has 1 ship', () => {
        expect(board.ships.length).toBe(1);
    });
    it('(The ship) has coordinates matching the board\'s true cells', () => {
        expect(board.ships[0].coordinates).toEqual([[0, 2], [0, 3], [0, 4]]);
    });
    it('Correctly places 4-long vertical ship on board', () => {
        expect(getBoardAfterPlace('vertical', 4, 1, 2)).toEqual(twoShips);
    });
    test('Should show board instance now has 2 ships', () => {
        expect(board.ships.length).toBe(2);
    });
    test('Should show board instance having only 3 remaining ships to place', () => {
        expect(board.shipsRemaining).toBe(3);
    });
    it('(The second ship) has coordinates matching the board\'s new true cells', () => {
        expect(board.ships[1].coordinates).toEqual([[1, 2], [2, 2], [3, 2], [4, 2]]);
    });


    const attemptIntersect = () => {
        board.currentShipOrientation = 'horizontal';
        board.currentShipSize = 3;
        board.placeShip(4, 0);
    };

    const attemptOutOfBounds = () => board.placeShip(4, 4);

    it('Rejects a 3-long horizontal ship that will not fit (will intersect existing ship)', () => {
        expect(attemptIntersect).toThrow(new Error('Ship will not fit'));
    });
    it('Places a 2-long horizontal ship in the previous spot (which will now fit)', () => {
        expect(getBoardAfterPlace('horizontal', 2, 4, 0)).toEqual(threeShips);
    });
    it('Rejects a 2-long horizontal ship that will not fit (will go out of bounds)', () => {
        expect(attemptOutOfBounds).toThrow(new Error('Ship will not fit'));
    });
});

describe('Board rejects ship placement if no ships remaining to place', () => {
    const board = new Gameboard(10, 10);
    [0, 1, 2, 3, 4].forEach(i => board.placeShip(i, 0));

    const attemptPlacementFits = () => board.placeShip(5, 0);
    const attemptIntersect = () => board.placeShip(3, 1);

    it('Does not place ship when there are no ships remaining', () => {
        expect(attemptPlacementFits).toThrow(new Error('No more ships left to place!'));
    });
    it('Prioritises ship count rejection over fitting rejection', () => {
        expect(attemptIntersect).toThrow(new Error('No more ships left to place!'));
    });
});