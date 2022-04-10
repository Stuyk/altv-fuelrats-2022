import { EVENT } from '@fuelrats/core';
import * as alt from 'alt-server';
import { ServerCanister } from './canister';

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

        // Repair Vehicle on Collision
        ServerCollision.repair(player);

        // Get the driver target...
        const target = closestVehicle.driver;
        if (!target) {
            return;
        }

        const ownerId = ServerCanister.getOwnerId();
        const isSomeoneOwner = player.id === ownerId || target.id === ownerId;

        if (!isSomeoneOwner) {
            return;
        }

        const transferTo = player.id === ownerId ? target : player;
        const uncolor = player.id === ownerId ? player : target;

        if (uncolor.vehicle) {
            uncolor.vehicle.customPrimaryColor = new alt.RGBA(255, 192, 203, 255);
            uncolor.vehicle.customSecondaryColor = new alt.RGBA(255, 192, 203, 255);
        }

        ServerCanister.transfer(transferTo);
    }

    /**
     * If the player is in a vehicle, set the engine health to 999 and repair the vehicle.
     * @param player - alt.Player - The player whose vehicle should be repaired.
     */
    static repair(player: alt.Player) {
        player.health = 199;
        player.armour = 199;

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
