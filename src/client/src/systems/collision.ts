import { EVENT } from '@fuelrats/core';
import * as alt from 'alt-client';
import * as native from 'natives';
import { getForwardVector } from '../utility/vector';

const TIME_BETWEEN_CHECKS = 60;

let nextCheck = Date.now() + TIME_BETWEEN_CHECKS;
let debug: boolean;
let lastRay;
let didCollide = false;

export class ClientCollision {
    static init(_debug: boolean = false) {
        alt.setInterval(ClientCollision.tick, 0);
        debug = _debug;
    }

    static debug(min: alt.Vector3, max: alt.Vector3) {
        if (alt.Player.local.vehicle) {
            const pos = alt.Player.local.vehicle.pos;
            const fwd = getForwardVector(alt.Player.local.vehicle.scriptID, new alt.Vector3(max.x, max.y, 0));

            if (didCollide) {
                native.drawLine(pos.x, pos.y, pos.z, fwd.x, fwd.y, pos.z, 0, 255, 0, 255);
            } else {
                native.drawLine(pos.x, pos.y, pos.z, fwd.x, fwd.y, pos.z, 255, 0, 0, 255);
            }
        }
    }

    /**
     * If the player is in a vehicle, check if the vehicle has collided with anything, if it has, emit
     * a server event to do something with the collision.
     */
    static tick() {
        if (!alt.Player.local.vehicle) {
            return;
        }

        const [_, min, max] = native.getModelDimensions(alt.Player.local.vehicle.model);

        if (debug) {
            ClientCollision.debug(min, max);
        }

        if (Date.now() < nextCheck) {
            return;
        }

        nextCheck = Date.now() + TIME_BETWEEN_CHECKS;
        didCollide = false;

        lastRay = native.startShapeTestBound(alt.Player.local.vehicle.scriptID, max.y, max.y);

        let [_a, _hit, _endCoords, _surfaceNormal, _entity] = native.getShapeTestResult(lastRay);

        if (!_hit) {
            return;
        }

        const closestVehicle = [...alt.Vehicle.all].find((vehicle) => {
            if (vehicle.scriptID === _entity) {
                return true;
            }

            return false;
        });

        if (!closestVehicle) {
            return;
        }

        if (!native.hasEntityCollidedWithAnything(alt.Player.local.vehicle.scriptID)) {
            didCollide = false;
            return;
        }

        didCollide = true;
        alt.emitServer(EVENT.TO_SERVER.COLLISION.EMIT, closestVehicle);
    }
}
