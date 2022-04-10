import * as alt from 'alt-server';
import { PlayerVehicle } from '../extensions/vehicle';
import { ServerCanister } from './canister';
import { ServerGoal } from './goal';

export class ServerBlips {
    static init() {
        alt.setInterval(ServerBlips.updateVehicles, 20);
        alt.setInterval(ServerBlips.updateCanister, 20);
        alt.setInterval(ServerBlips.updateGoal, 20);
    }

    /**
     * It updates the position of the blip on the map for all vehicles.
     */
    static updateVehicles() {
        const vehicles = [...alt.Vehicle.all];

        for (let i = 0; i < vehicles.length; i++) {
            const vehicle = vehicles[i] as PlayerVehicle;
            if (!vehicle || !vehicle.valid) {
                continue;
            }

            vehicle.updateBlipPosition();
        }
    }

    /**
     * This function updates the position of the blip on the map.
     */
    static updateCanister() {
        ServerCanister.updateBlipPosition();
    }

    static updateGoal() {
        ServerGoal.updateBlipPosition();
    }
}
