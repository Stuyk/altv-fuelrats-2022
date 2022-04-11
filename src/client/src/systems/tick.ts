import { SYNCED_META } from '@fuelrats/core';
import * as alt from 'alt-client';
import * as native from 'natives';

const DISABLED_CONTROLS: { [key: string]: number } = {
    ATTACK: 24,
    AIM: 25,
    RELOAD: 45,
    VEH_ATTACK: 69,
    VEH_ATTACK_2: 70,
    VEH_EXIT: 75,
    VEH_PASSENGER_AIM: 91,
    VEH_PASSENGER_ATTACK: 92,
    VEH_FLY_ATTACK: 114,
    MELEE_ATTACK_LIGHT: 140,
    MELEE_ATTACK_HEAVY: 141,
    MELEE_ATTACK_ALTERNATE: 142,
    MELEE_ATTACK_BLOCK: 143,
    ATTACK2: 257,
    MELEE_ATTACK_1: 263,
    MELEE_ATTACK_2: 264,
    VEH_MELEE_LEFT: 346,
    VEH_MELEE_RIGHT: 347,
    VEH_FLY_ATTACK_2: 331,
};

export class Tick {
    static init() {
        alt.setInterval(Tick.handle, 0);
    }

    static handle() {
        Tick.handleSpeed();
        native.disablePlayerFiring(alt.Player.local.scriptID, true);
        Object.keys(DISABLED_CONTROLS).forEach((key) => {
            const value = DISABLED_CONTROLS[key];
            native.disableControlAction(0, value, true);
        });

        const players = [...alt.Player.all];

        for (let i = 0; i < players.length; i++) {
            const player = players[i];

            if (player.id === alt.Player.local.id) {
                const isSelfFrozen = alt.Player.local.getSyncedMeta(SYNCED_META.VEHICLE.FREEZE_ON) as boolean;

                if (alt.Player.local.vehicle) {
                    native.freezeEntityPosition(alt.Player.local.vehicle.scriptID, isSelfFrozen);
                    native.freezeEntityPosition(alt.Player.local.scriptID, false);
                } else {
                    native.freezeEntityPosition(alt.Player.local.scriptID, isSelfFrozen);
                }

                continue;
            }

            if (!player.vehicle) {
                continue;
            }

            const isFrozen = player.getSyncedMeta(SYNCED_META.VEHICLE.FREEZE_ON) as boolean;
            const isCollisionOff = player.getSyncedMeta(SYNCED_META.VEHICLE.COLLISION_OFF) as boolean;

            Tick.handleFreeze(player, isFrozen);
            Tick.handleCollision(player, isCollisionOff);
        }
    }

    static handleSpeed() {
        if (!alt.Player.local.vehicle) {
            return;
        }

        const isMetric = native.getProfileSetting(227);
        const currentSpeed = native.getEntitySpeed(alt.Player.local.vehicle.scriptID);
        const speedCalc = (currentSpeed * (isMetric ? 3.6 : 2.236936)).toFixed(0);
        native.setVehicleNumberPlateText(alt.Player.local.vehicle.scriptID, speedCalc);
    }

    static handleFreeze(player: alt.Player, isFrozen: boolean) {
        if (player.vehicle) {
            native.freezeEntityPosition(player.vehicle.scriptID, isFrozen);
        }

        native.freezeEntityPosition(player.scriptID, isFrozen);
    }

    static handleCollision(player: alt.Player, isCollisionOff: boolean) {
        if (player.vehicle) {
            if (isCollisionOff) {
                native.setEntityAlpha(player.vehicle.scriptID, 100, true);
            } else {
                native.setEntityAlpha(player.vehicle.scriptID, 255, true);
            }
        }

        if (!isCollisionOff) {
            return;
        }

        if (alt.Player.local.vehicle && player.vehicle) {
            native.setEntityNoCollisionEntity(alt.Player.local.vehicle.scriptID, player.vehicle.scriptID, true);
        }

        if (alt.Player.local.vehicle && !player.vehicle) {
            native.setEntityNoCollisionEntity(alt.Player.local.vehicle.scriptID, player.scriptID, true);
        }

        if (!alt.Player.local.vehicle && player.vehicle) {
            native.setEntityNoCollisionEntity(alt.Player.local.scriptID, player.vehicle.scriptID, true);
        }

        if (!alt.Player.local.vehicle && !player.vehicle) {
            native.setEntityNoCollisionEntity(alt.Player.local.scriptID, player.scriptID, true);
        }
    }
}
