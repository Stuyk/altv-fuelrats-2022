import { SYNCED_META } from '@fuelrats/core';
import * as alt from 'alt-client';
import * as native from 'natives';
import { PowerUp } from '../systems/powerup';

export class PowerUpJump {
    static init() {
        // Left Control
        PowerUp.registerPowerUp(60, SYNCED_META.PLAYER.JUMP_AVAILABLE, PowerUpJump.handleJump);
    }

    static handleJump() {
        if (!alt.Player.local.vehicle) {
            return;
        }

        const velocity = { ...native.getEntityVelocity(alt.Player.local.vehicle.scriptID) };
        velocity.z += 6;
        native.setEntityVelocity(alt.Player.local.vehicle.scriptID, velocity.x, velocity.y, velocity.z);
    }
}
