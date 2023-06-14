import { Ship } from '../js/ship.js';

export function getShipLength(n) {
    const ship = new Ship(n);
    return ship.length;
}

export function getShipCoords(n, array) {
    const ship = new Ship(n, array);
    return ship.coordinates;
}

export function hitShip(ship, coordinate) {
    ship.hit(coordinate);
    return ship.coordinates;
}