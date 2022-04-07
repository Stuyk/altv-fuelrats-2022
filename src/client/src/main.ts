import * as alt from 'alt-client';
import { events } from '@fuelrats/core';

alt.onServer(events.toClient.log.console, handleLogConsole);

function handleLogConsole(message: string) {
    alt.log(message);
}
