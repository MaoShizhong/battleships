import { Gameboard } from '../ts/gameboard';

describe('Board receives hit and handles hit/miss/not valid', () => {
    const board = new Gameboard(5, 5);
    board.placeShip(0, 0);
    board.placeShip(4, 0);

    const castAttack = (y, x) => {
        board.receiveAttack(y, x);
        return board.board;
    };

    const attackRepeatSquare = () => board.receiveAttack(4, 1);
    const attackOutOfBoundsSquare = () => board.receiveAttack(6, 2);

    const miss = [
        [true, true, true, true, true],
        [false, false, false, false, false],
        [false, false, 'miss', false, false],
        [false, false, false, false, false],
        [true, true, true, true, true],
    ];

    const hit = [
        [true, true, true, true, true],
        [false, false, false, false, false],
        [false, false, 'miss', false, false],
        [false, false, false, false, false],
        [true, 'hit', true, true, true],
    ];

    it('Registers a valid miss on the board', () => {
        expect(castAttack(2, 2)).toEqual(miss);
    });
    it('Registers a valid hit on the same board', () => {
        expect(castAttack(4, 1)).toEqual(hit);
    });
    it('Throws an error if attack targets a previously attacked square', () => {
        expect(attackRepeatSquare).toThrow(
            new Error('You have already targeted this square before! Please pick another square.')
        );
    });
    it('Throws an error if attempting to attack a square that is out of bounds', () => {
        expect(attackOutOfBoundsSquare).toThrow(new Error('This square is out of bounds!'));
    });
});

describe('Successful hit registers on respective ship', () => {
    const board = new Gameboard(5, 5);
    board.placeShip(0, 0);
    board.placeShip(1, 0);
    board.receiveAttack(0, 2);
    board.receiveAttack(1, 4);

    const shipCoordinates = [
        [
            2,
            0,
            [
                [0, 0],
                [0, 1],
                ['X', 'X'],
                [0, 3],
                [0, 4],
            ],
        ],
        [
            4,
            1,
            [
                [1, 0],
                [1, 1],
                [1, 2],
                [1, 3],
                ['X', 'X'],
            ],
        ],
    ];

    test.each(shipCoordinates)("Shows hit ['X', 'X'] at index %d", (index, shipIndex, array) =>
        expect(board.ships[shipIndex].coordinates).toEqual(array)
    );
});

describe('Hitting all ship squares sinks and removes ship from board instance', () => {
    const board = new Gameboard(5, 5);
    board.placeShip(0, 0);
    board.placeShip(4, 0);

    const sinkShip = (y) => {
        [
            [y, 0],
            [y, 1],
            [y, 2],
            [y, 3],
            [y, 4],
        ].forEach((square) => {
            board.receiveAttack(square[0], square[1]);
        });
        return board.ships.length;
    };

    const findShipByCoordinate = (y, x) => {
        return board.ships.includes(
            board.ships.find((ship) => ship.coordinates.find(([a, b]) => a === y && b === x))
        );
    };

    it('Contains the first ship in the instance ship array', () => {
        expect(findShipByCoordinate(0, 2)).toBe(true);
    });
    it('Removes first ship from board instance after sinking', () => {
        expect(sinkShip(0)).toBe(1);
    });
    it('Successfully removed the correct ship', () => {
        expect(findShipByCoordinate(0, 2)).toBe(false);
    });
    it('Does not trigger game over when ships still remain', () => {
        expect(board.isGameOver).toBe(false);
    });
    it('Removes second (new first) ship from board instance after sinking', () => {
        expect(sinkShip(4)).toBe(0);
    });
    it('Detects game over after all ships sunk', () => {
        expect(board.isGameOver).toBe(true);
    });
});
