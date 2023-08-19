import { Ship } from '../ts/ship';

describe('Instantiate ship with a given coordinates array (for hit testing only)', () => {
    const arrays = [
        [
            [
                [1, 5],
                [3, 6],
            ],
            2,
        ],
        [
            [
                [1, 5],
                [5, 0],
                [3, 2],
                [4, 4],
                [0, 0],
            ],
            5,
        ],
    ];

    test.each(arrays)('%p correctly loaded as this.coordinates', (array) =>
        expect(new Ship(array).coordinates).toEqual(array)
    );
    test.each(arrays)('%p correctly sets this.length', (array, length) =>
        expect(new Ship(array).length).toEqual(length)
    );
});

describe('Test ship.hit and .isSunk', () => {
    const shipOne = new Ship([
        [1, 5],
        [3, 6],
    ]);
    const shipTwo = new Ship([
        [1, 5],
        [5, 0],
        [3, 2],
        [4, 4],
    ]);

    function hitShip(ship, y, x) {
        ship.hit(y, x);
        return ship.coordinates;
    }

    test('Should change hit coordinate in this.coordinates array', () => {
        expect(hitShip(shipOne, 1, 5)).toEqual([
            ['X', 'X'],
            [3, 6],
        ]);
    });
    test('Should change hit coordinate in this.coordinates array', () => {
        expect(hitShip(shipTwo, 5, 0)).toEqual([
            [1, 5],
            ['X', 'X'],
            [3, 2],
            [4, 4],
        ]);
    });
    test('Should hit previous ship and carry over previous hit', () => {
        expect(hitShip(shipTwo, 3, 2)).toEqual([
            [1, 5],
            ['X', 'X'],
            ['X', 'X'],
            [4, 4],
        ]);
    });
    test('Should hit previous ship and carry over previous hit', () => {
        expect(hitShip(shipTwo, 4, 4)).toEqual([
            [1, 5],
            ['X', 'X'],
            ['X', 'X'],
            ['X', 'X'],
        ]);
    });
    test('Should hit previous ship and carry over previous hit', () => {
        expect(hitShip(shipTwo, 1, 5)).toEqual([
            ['X', 'X'],
            ['X', 'X'],
            ['X', 'X'],
            ['X', 'X'],
        ]);
    });
    it('Is is not sunk if not-yet-hit coordinates exist', () => {
        expect(shipOne.isSunk()).toBe(false);
    });
    it('Is sunk when all coordinates are hit', () => {
        expect(shipTwo.isSunk()).toBe(true);
    });
});
