import { EVENT } from '@fuelrats/core';
import * as alt from 'alt-client';
import { EnterVehicleEvent } from './events/enterVehicle';

import { WebViewController } from './extensions/view';
import { PowerUpBoost } from './powerups/boost';
import { PowerUpJump } from './powerups/jump';
import { ClientCanister } from './systems/canister';
import { ClientCollision } from './systems/collision';
import { ClientMarkers } from './systems/markers';
import { PowerUp } from './systems/powerup';
import { Tick } from './systems/tick';
import { WorldSync } from './systems/worldSync';
import { Console } from './utility/console';
import { FrontendSound } from './utility/sound';

let debug = true;

class InternalFunctions {
    static init() {
        WebViewController.init(debug);
        ClientCanister.init(debug);
        ClientCollision.init(debug);

        // Events
        EnterVehicleEvent.init();

        // Initialize Markers
        ClientMarkers.init(debug);

        // Utilities
        FrontendSound.init();

        // Power Up System
        PowerUp.init();
        PowerUpBoost.init();
        PowerUpJump.init();
        WorldSync.init();

        // Tick
        Tick.init();

        // Debug Stuffs
        Console.init();
        alt.onServer(EVENT.TO_CLIENT.LOG.CONSOLE, InternalFunctions.handleServerToClientLog);

        alt.on('connectionComplete', () => {
            alt.emitServer('connect');
        });
    }

    static handleServerToClientLog(message: string) {
        alt.log(message);
    }
}

InternalFunctions.init();
