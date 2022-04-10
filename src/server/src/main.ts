import * as alt from 'alt-server';
import { EVENT } from '@fuelrats/core';
import { ReconnectHelper } from './utility/reconnect';
import { ConfigHelper } from './utility/config';
import { PlayerVehicle } from './extensions/vehicle';
import { ServerCollision } from './systems/collision';
import { ServerCanister } from './systems/canister';
import { ServerBlips } from './systems/blips';
import { ServerPowerUp } from './systems/powerup';
import { ServerGoal } from './systems/goal';
import { ServerMarkers } from './systems/markers';
import { ServerRound } from './systems/round';
import { ServerDeath } from './events/death';
import { ServerMap } from './systems/map';

alt.log(`alt:V Server - Boilerplate Started`);

const SPAWN = new alt.Vector3(-266.91, -1164.53, 25.44);

let debug = true;

class Main {
    static init() {
        alt.onClient('connect', Main.playerConnect);
        ServerDeath.init();
        //
        ServerCollision.init(debug);
        ServerCanister.init(debug);
        // ServerCanister.create(new alt.Vector3(SPAWN.x - 6, SPAWN.y, 22.44));
        ServerBlips.init();
        // ServerGoal.create(new alt.Vector3(SPAWN.x - 12, SPAWN.y, 22.44));
        ServerPowerUp.init();

        ServerRound.init();
        ReconnectHelper.invoke();
    }

    static async playerConnect(player: alt.Player) {
        alt.log(`[${player.id}] ${player.name} has connected to the server.`);

        await player.spawn(ServerMap.getSpawn().x, ServerMap.getSpawn().y, ServerMap.getSpawn().z);

        const isReady = await new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (player && !player.valid) {
                    return;
                }

                if (!player) {
                    alt.clearInterval(interval);
                    resolve(false);
                    return;
                }

                alt.clearInterval(interval);
                resolve(true);
            }, 200);
        });

        if (!isReady) {
            return;
        }

        if (!player || !player.valid) {
            return;
        }

        alt.emitClient(player, EVENT.TO_CLIENT.LOG.CONSOLE, 'Fuel Rats - Connected');
        alt.emitClient(player, EVENT.TO_CLIENT.WEBVIEW.SET_URL, ConfigHelper.getWebviewPath());

        await ServerCanister.sync(player);
        await ServerPowerUp.refreshAllCooldowns(player);
        await ServerMarkers.sync(player);
        await ServerRound.sync(player);

        player.setDateTime(24, 1, 1, 9, 0, 0);
    }
}

Main.init();
