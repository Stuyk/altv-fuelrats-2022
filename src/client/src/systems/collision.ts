import { EVENT } from '@fuelrats/core';
import * as alt from 'alt-client';
import * as native from 'natives';
import { getForwardVector } from '../utility/vector';

const TIME_BETWEEN_CHECKS = 60;

let nextCheck = Date.now() + TIME_BETWEEN_CHECKS;
let debug: boolean;
let lastRay;

export class ClientCollision {
    static init(_debug: boolean = false) {
        alt.setInterval(ClientCollision.tick, 0);
        debug = _debug;
    }

    /**
     * If the player is in a vehicle, check if the vehicle has collided with anything, if it has, emit
     * a server event to do something with the collision.
     */
    static tick() {
        if (!alt.Player.local.vehicle) {
            return;
        }

        if (Date.now() < nextCheck) {
            return;
        }

        nextCheck = Date.now() + TIME_BETWEEN_CHECKS;

        lastRay = native.startShapeTestBound(alt.Player.local.vehicle.scriptID, 2, 2);

        let [_a, _hit, _endCoords, _surfaceNormal, _entity] = native.getShapeTestResult(lastRay);

        if (!_hit) {
            return;
        }

        const closestVehicle = [...alt.Vehicle.all].find((vehicle) => {
            if (vehicle.scriptID === alt.Player.local.vehicle?.scriptID) {
                return false;
            }

            if (vehicle.scriptID === _entity) {
                return true;
            }

            return false;
        });

        if (!closestVehicle) {
            return;
        }

        if (!native.hasEntityCollidedWithAnything(alt.Player.local.vehicle.scriptID)) {
            return;
        }

        if (debug) {
            native.playSoundFrontend(-1, 'Click', 'DLC_HEIST_HACKING_SNAKE_SOUNDS', true);
        }

        alt.emitServer(EVENT.TO_SERVER.COLLISION.EMIT, closestVehicle);
    }
}
