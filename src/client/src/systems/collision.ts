import { EVENT, SYNCED_META } from '@fuelrats/core';
import * as alt from 'alt-client';
import * as native from 'natives';
import { getForwardVector } from '../utility/vector';

const TIME_BETWEEN_CHECKS = 60;
const METAS = [SYNCED_META.VEHICLE.FREEZE_ON];

let nextCheck = Date.now() + TIME_BETWEEN_CHECKS;
let debug: boolean;
let lastRay;

export class ClientCollision {
    static init(_debug: boolean = false) {
        alt.on('syncedMetaChange', ClientCollision.collisionChange);
        alt.setInterval(ClientCollision.tick, 0);
        debug = _debug;
    }

    static collisionChange(entity: alt.Entity, key: string, value: any, oldValue: any) {
        if (!(entity instanceof alt.Player)) {
            return;
        }

        let isValid = false;

        for (let i = 0; i < METAS.length; i++) {
            if (key !== METAS[i]) {
                continue;
            }

            alt.log('found valid...');
            isValid = true;
            break;
        }

        if (!isValid) {
            return;
        }

        console.log(key);
        console.log(SYNCED_META.VEHICLE.FREEZE_ON);
        if (key === SYNCED_META.VEHICLE.FREEZE_ON) {
            if (alt.Player.local.vehicle) {
                native.freezeEntityPosition(alt.Player.local.vehicle.scriptID, value);
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

        alt.Player.all.forEach((player) => {
            if (!player || !player.vehicle || !player.valid) {
                return;
            }

            if (player.id === alt.Player.local.id) {
                return;
            }

            if (player.getSyncedMeta(SYNCED_META.VEHICLE.FREEZE_ON)) {
                native.freezeEntityPosition(player.vehicle.scriptID, true);
            } else {
                native.freezeEntityPosition(player.vehicle.scriptID, false);
            }

            if (player.getSyncedMeta(SYNCED_META.VEHICLE.COLLISION_OFF)) {
                native.setEntityCollision(player.vehicle.scriptID, false, false);
            } else {
                native.setEntityCollision(player.vehicle.scriptID, true, true);
            }
        });

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
