import * as alt from 'alt-server';
import { EVENT } from '@fuelrats/core';
import { ReconnectHelper } from './utility/reconnect';
import { ConfigHelper } from './utility/config';

alt.log(`alt:V Server - Boilerplate Started`);
alt.on('playerConnect', handlePlayerConnect);

function handlePlayerConnect(player: alt.Player) {
    alt.emitClient(player, EVENT.TO_CLIENT.LOG.CONSOLE, 'Fuel Rats - Connected');
    alt.emitClient(player, EVENT.TO_CLIENT.WEBVIEW.SET_URL, ConfigHelper.getWebviewPath());

    alt.log(`[${player.id}] ${player.name} has connected to the server.`);

    player.model = 'mp_m_freemode_01';
    player.spawn(36.19486618041992, 859.3850708007812, 197.71343994140625, 0);
}

// Should always be loaded last.
ReconnectHelper.invoke();
