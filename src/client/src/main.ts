import * as alt from 'alt-client';
import { EVENT } from '@fuelrats/core';
import { WebViewController } from './extensions/view';
import { ClientCanister } from './systems/canister';
import { ClientCollision } from './systems/collision';
import { PowerUp } from './systems/powerup';
import { PowerUpBoost } from './powerups/boost';
import { PowerUpJump } from './powerups/jump';
import { FrontendSound } from './utility/sound';
import { ClientMarkers } from './systems/markers';
import { Console } from './utility/console';

let debug = true;

class InternalFunctions {
    static init() {
        WebViewController.init(debug);
        ClientCanister.init(debug);
        ClientCollision.init(debug);

        // Initialize Markers
        ClientMarkers.init(debug);

        // Utilities
        FrontendSound.init();
        // Power Up System
        PowerUp.init();
        PowerUpBoost.init();
        PowerUpJump.init();
        // Debug Stuffs
        Console.init();
        alt.onServer(EVENT.TO_CLIENT.LOG.CONSOLE, InternalFunctions.handleServerToClientLog);
    }

    static handleServerToClientLog(message: string) {
        alt.log(message);
    }
}

InternalFunctions.init();
