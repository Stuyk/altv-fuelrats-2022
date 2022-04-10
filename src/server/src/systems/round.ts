import { EVENT, SYNCED_META } from '@fuelrats/core';
import * as alt from 'alt-server';
import { PlayerVehicle } from '../extensions/vehicle';
import { ServerCanister } from './canister';
import { ServerGoal } from './goal';
import { ServerMap } from './map';
import { ServerPowerUp } from './powerup';

let debug = false;
let roundFinishTime: number;
let isUpdatingRound: boolean = false;
let scores: { [key: string]: number } = {};

export class ServerRound {
    static init(_debug = false) {
        debug = _debug;

        // When a goal is scored, called the start function to reset the roud.
        ServerGoal.addCallback(ServerRound.next);

        // Initialize the map loading sequence...
        ServerMap.nextMap();

        // Start the first round...
        ServerRound.next(null);
    }

    static isUpdating(): boolean {
        return isUpdatingRound;
    }

    static async next(winner: alt.Player | null) {
        if (isUpdatingRound) {
            return;
        }

        isUpdatingRound = true;

        ServerMap.randomizeVehicle();

        if (winner) {
            if (!scores[winner.id]) {
                scores[winner.id] = 1;
            } else {
                scores[winner.id] += 1;
            }

            isUpdatingRound = false;

            if (scores[winner.id] >= ServerMap.getMaxScore()) {
                scores = {};

                // Announce Winner
                ServerMap.nextMap();

                // Increment to Next Round
                ServerRound.next(null);
                return;
            }
        }

        const canister = ServerMap.getCanister();
        const goal = ServerMap.getGoal();

        roundFinishTime = Date.now() + ServerMap.getRoundTime();

        ServerCanister.create(new alt.Vector3(canister.x, canister.y, canister.z));
        ServerGoal.create(new alt.Vector3(goal.x, goal.y, goal.z));

        alt.Player.all.forEach((player) => {
            if (!player.vehicle) {
                return;
            }

            ServerRound.sync(player);
            player.setSyncedMeta(SYNCED_META.VEHICLE.COLLISION_OFF, true);
            player.setSyncedMeta(SYNCED_META.VEHICLE.FREEZE_ON, true);
        });

        await new Promise((resolve: Function) => {
            alt.setTimeout(() => {
                resolve();
            }, 2000);
        });

        isUpdatingRound = false;

        alt.setTimeout(() => {
            alt.emitAllClients(EVENT.TO_CLIENT.SOUND.FRONTEND, 'Event_Start_Text', 'GTAO_FM_Events_Soundset');

            alt.Player.all.forEach((player) => {
                if (!player || !player.valid || !player.vehicle) {
                    return;
                }

                player.setSyncedMeta(SYNCED_META.VEHICLE.FREEZE_ON, false);
                ServerPowerUp.refreshAllCooldowns(player);
            });
        }, 3000);
    }

    static async sync(player: alt.Player) {
        const spawn = ServerMap.getSpawn();

        if (player.vehicle && player.vehicle instanceof PlayerVehicle) {
            await player.vehicle.remove();
        }

        await new PlayerVehicle(player, ServerMap.getVehicle(), new alt.Vector3(spawn.x, spawn.y, spawn.z));

        await new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!player.vehicle) {
                    return;
                }

                resolve();
                alt.clearInterval(interval);
            }, 100);
        });

        if (!player.vehicle) {
            return;
        }

        player.vehicle.pos = new alt.Vector3(spawn.x, spawn.y, spawn.z);
    }
}
