import * as alt from 'alt-server';
import { EVENT, SYNCED_META } from '@fuelrats/core';

const COOLDOWNS = {
    [SYNCED_META.PLAYER.BOOST_AVAILABLE]: 15000,
    [SYNCED_META.PLAYER.JUMP_AVAILABLE]: 10000,
};

export class ServerPowerUp {
    static init() {
        alt.onClient(EVENT.TO_SERVER.POWERUP.USE, ServerPowerUp.usePowerUp);
    }

    static refreshAllCooldowns(player: alt.Player) {
        Object.keys(COOLDOWNS).forEach((key) => {
            player.setSyncedMeta(key, true);
        });
    }

    static usePowerUp(player: alt.Player, syncedMetaName: string) {
        const ms = COOLDOWNS[syncedMetaName] ? COOLDOWNS[syncedMetaName] : 10000;

        player.setSyncedMeta(syncedMetaName, false);
        alt.setTimeout(() => {
            if (!player || !player.valid) {
                return;
            }

            player.setSyncedMeta(syncedMetaName, true);
        }, ms);
    }
}
