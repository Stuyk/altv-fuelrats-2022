import { SYNCED_META } from '@fuelrats/core';
import * as alt from 'alt-client';
import * as native from 'natives';
import { PowerUp } from '../systems/powerup';

export class PowerUpBoost {
    static init() {
        // Left Shift
        PowerUp.registerPowerUp(61, SYNCED_META.PLAYER.BOOST_AVAILABLE, PowerUpBoost.handleBoost);
    }

    static handleBoost() {
        if (!alt.Player.local.vehicle) {
            return;
        }

        const speed = native.getEntitySpeed(alt.Player.local.vehicle.scriptID);
        native.setVehicleBoostActive(alt.Player.local.vehicle.scriptID, true);
        native.setVehicleForwardSpeed(alt.Player.local.vehicle.scriptID, speed + 15);
        native.animpostfxPlay('RaceTurbo', 0, false);
        native.setVehicleBoostActive(alt.Player.local.vehicle.scriptID, false);
    }
}
