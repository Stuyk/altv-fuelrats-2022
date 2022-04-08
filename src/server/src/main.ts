import * as alt from 'alt-server';
import { EVENT } from '@fuelrats/core';
import { ReconnectHelper } from './utility/reconnect';
import { ConfigHelper } from './utility/config';
import { PlayerVehicle } from './extensions/vehicle';
import { ServerCollision } from './systems/collision';
<<<<<<< HEAD
import { ServerCanister } from './systems/canister';
=======
>>>>>>> 4318fb850e53aad6f96d78bafb1835bcff8aac74

alt.log(`alt:V Server - Boilerplate Started`);

const SPAWN = new alt.Vector3(-266.91, -1164.53, 25.44);

let debug = true;

class Main {
    static init() {
        alt.on('playerConnect', Main.playerConnect);
        ServerCollision.init(debug);
        ReconnectHelper.invoke();

        ServerCanister.create(new alt.Vector3(SPAWN.x - 6, SPAWN.y, 22.44));
        const blip = new alt.PointBlip(SPAWN.x - 6, SPAWN.y, 22.44);
        blip.sprite = 1;
        blip.name = 'test';
    }

    static playerConnect(player: alt.Player) {
        alt.log(`[${player.id}] ${player.name} has connected to the server.`);

        alt.emitClient(player, EVENT.TO_CLIENT.LOG.CONSOLE, 'Fuel Rats - Connected');
        alt.emitClient(player, EVENT.TO_CLIENT.WEBVIEW.SET_URL, ConfigHelper.getWebviewPath());

        new PlayerVehicle(player, 'adder', SPAWN);

        ServerCanister.sync(player);

        // ! - DEBUG REMEMBER TO REMOVE
        const something = new alt.Vehicle('infernus', SPAWN.x, SPAWN.y + 5, 25.44, 0, 0, 0);
    }
}

Main.init();
