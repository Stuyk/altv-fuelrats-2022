import * as alt from 'alt-server';
import { EVENT, SYNCED_META } from '@fuelrats/core';

const COOLDOWNS = {
    [SYNCED_META.PLAYER.BOOST_AVAILABLE]: 15000,
    [SYNCED_META.PLAYER.JUMP_AVAILABLE]: 10000,
};

const SOUNDS = {
    [SYNCED_META.PLAYER.JUMP_AVAILABLE]: {
        USE: {
            audio: 'QUIT_WHOOSH',
            dict: 'HUD_MINI_GAME_SOUNDSET',
        },
        COOLDOWN: {
            audio: 'CONFIRM_BEEP',
            dict: 'HUD_MINI_GAME_SOUNDSET',
        },
    },
    [SYNCED_META.PLAYER.BOOST_AVAILABLE]: {
        COOLDOWN: {
            audio: 'CONFIRM_BEEP',
            dict: 'HUD_MINI_GAME_SOUNDSET',
        },
    },
};

let timeouts: { [playerid: string]: { [metaname: string]: number } } = {};

export class ServerPowerUp {
    static init() {
        alt.onClient(EVENT.TO_SERVER.POWERUP.USE, ServerPowerUp.usePowerUp);
    }

    /**
     * It loops through all the keys in the COOLDOWNS object and sets the player's synced meta to true,
     * effectively allowing the player to use any power up.
     * @param player - alt.Player - The player to refresh the cooldowns for.
     */
    static refreshAllCooldowns(player: alt.Player) {
        if (timeouts[player.id]) {
            if (timeouts[player.id][SYNCED_META.PLAYER.BOOST_AVAILABLE]) {
                alt.clearTimeout(timeouts[player.id][SYNCED_META.PLAYER.BOOST_AVAILABLE]);
                delete timeouts[player.id][SYNCED_META.PLAYER.BOOST_AVAILABLE];
            }

            if (timeouts[player.id][SYNCED_META.PLAYER.JUMP_AVAILABLE]) {
                alt.clearTimeout(timeouts[player.id][SYNCED_META.PLAYER.JUMP_AVAILABLE]);
                delete timeouts[player.id][SYNCED_META.PLAYER.JUMP_AVAILABLE];
            }
        }

        Object.keys(COOLDOWNS).forEach((key) => {
            player.setSyncedMeta(key, true);
        });
    }

    /**
     * If the player has a powerup, play a sound, set the powerup to false, and after set amount of seconds, play
     * a sound and set the powerup to true.
     * @param player - alt.Player - The player who is using the powerup.
     * @param {string} syncedMetaName - The name of the synced meta you want to use.
     */
    static usePowerUp(player: alt.Player, syncedMetaName: string) {
        if (timeouts[player.id] && timeouts[player.id][syncedMetaName]) {
            return;
        }

        const ms = COOLDOWNS[syncedMetaName] ? COOLDOWNS[syncedMetaName] : 10000;

        if (SOUNDS[syncedMetaName].USE) {
            alt.emitClient(
                player,
                EVENT.TO_CLIENT.SOUND.FRONTEND,
                SOUNDS[syncedMetaName].USE?.audio,
                SOUNDS[syncedMetaName].USE?.dict
            );
        }

        player.setSyncedMeta(syncedMetaName, false);

        if (!timeouts[player.id]) {
            timeouts[player.id] = {};
        }

        timeouts[player.id][syncedMetaName] = alt.setTimeout(() => {
            if (!player || !player.valid) {
                return;
            }

            if (SOUNDS[syncedMetaName].COOLDOWN) {
                alt.emitClient(
                    player,
                    EVENT.TO_CLIENT.SOUND.FRONTEND,
                    SOUNDS[syncedMetaName].COOLDOWN?.audio,
                    SOUNDS[syncedMetaName].COOLDOWN?.dict
                );
            }

            delete timeouts[player.id][syncedMetaName];
            player.setSyncedMeta(syncedMetaName, true);
        }, ms);
    }
}
