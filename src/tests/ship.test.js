import { getShipLength, getShipCoords, hitShip } from './test_funcs.js';
import { Ship } from '../js/ship.js';

describe('Instantiates ship of given length', () => {
    test('Should generate a 2-length ship', () => {
        expect(getShipLength(2)).toBe(2);
    });
    test('Should generate a 4-length ship', () => {
        expect(getShipLength(4)).toBe(4);
    });
    test('Should generate a 5-length ship', () => {
        expect(getShipLength(5)).toBe(5);
    });
    test('Should generate a ship with a 2-length array of empty arrays', () => {
        expect(getShipCoords(2)).toEqual([[,], [,]]);
    });
    test('Should generate a ship with a 4-length array of empty arrays', () => {
        expect(getShipCoords(4)).toEqual([[,], [,], [,], [,]]);
    });
});

describe('Instantiate ship with a given coordinates array (for hit testing only)', () => {
    const arrays = [
        [[1, 5], [3, 6]],
        [[1, 5], [5, 0], [3, 2], [4, 4], [0, 0]],
    ];

    test.each(arrays)(
        'this.coordinates matches array passed as constructor arg',
        (array) => expect(getShipCoords(array.length, array)).toEqual(array)
    );
});

describe('Test ship.hit and .isSunk', () => {
    const shipOne = new Ship(2, [[1, 5], [3, 6]]);
    const shipTwo = new Ship(4, [[1, 5], [5, 0], [3, 2], [4, 4]]);

    test('Should change hit coordinate in this.coordinates array', () => {
        expect(hitShip(shipOne, [1, 5])).toEqual([['X', 'X'], [3, 6]]);
    });
    test('Should change hit coordinate in this.coordinates array', () => {
        expect(hitShip(shipTwo, [5, 0])).toEqual([[1, 5], ['X', 'X'], [3, 2], [4, 4]]);
    });
    test('Should hit previous ship and carry over previous hit', () => {
        expect(hitShip(shipTwo, [3, 2])).toEqual([[1, 5], ['X', 'X'], ['X', 'X'], [4, 4]]);
    });
    test('Should hit previous ship and carry over previous hit', () => {
        expect(hitShip(shipTwo, [4, 4])).toEqual([[1, 5], ['X', 'X'], ['X', 'X'], ['X', 'X']]);
    });
    test('Should hit previous ship and carry over previous hit', () => {
        expect(hitShip(shipTwo, [1, 5])).toEqual([['X', 'X'], ['X', 'X'], ['X', 'X'], ['X', 'X']]);
    });
    it('Is is not sunk if unhit coordinates exist', () => {
        expect(shipOne.isSunk()).toBe(false);
    });
    it('Is sunk when all coordinates are hit', () => {
        expect(shipTwo.isSunk()).toBe(true);
    });
});