import { EVENT } from '@fuelrats/core';
import * as alt from 'alt-server';

let debug = false;

export class ServerCollision {
    static init(_debug: boolean = false) {
        debug = _debug;
        alt.onClient(EVENT.TO_SERVER.COLLISION.EMIT, ServerCollision.event);
    }

    static event(player: alt.Player, closestVehicle: alt.Vehicle) {
        if (debug) {
            alt.log(`Got Collision from ${player.id} with vehicle ${closestVehicle.id}`);
        }
    }
}
