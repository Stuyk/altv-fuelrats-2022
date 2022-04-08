import { EVENT } from '@fuelrats/core';
import * as alt from 'alt-server';

let debug = false;

export class ServerCollision {
    static init(_debug: boolean = false) {
        debug = _debug;
        alt.onClient(EVENT.TO_SERVER.COLLISION.EMIT, ServerCollision.event);
    }

    static event(player: alt.Player, closestVehicle: alt.Vehicle) {
        // Verify Passed Data
        if (!player || !closestVehicle || !player.valid || !closestVehicle.valid) {
            return;
        }

        if (debug) {
            alt.log(`[Debug] Collision from ${player.id} with vehicle ${closestVehicle.id}`);
        }

        ServerCollision.repair(player);
    }

    /**
     * If the player is in a vehicle, set the engine health to 999 and repair the vehicle.
     * @param player - alt.Player - The player whose vehicle should be repaired.
     */
    static repair(player: alt.Player) {
        if (!player.vehicle) {
            return;
        }

        if (debug) {
            alt.log(`[Debug] Old Vehicle Health for ${player.id} - ${player.vehicle.engineHealth}`);
        }

        player.vehicle.engineHealth = 999;
        player.vehicle.repair();

        if (debug) {
            alt.log(`[Debug] New Vehicle Health for ${player.id} - ${player.vehicle.engineHealth}`);
        }
    }
}
