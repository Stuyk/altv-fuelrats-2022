import * as alt from 'alt-client';
import { EVENT } from '@fuelrats/core';
import { WebViewController } from './extensions/view';
import { ClientCanister } from './systems/canister';
import { ClientCollision } from './systems/collision';

let debug = true;

class InternalFunctions {
    static init() {
        WebViewController.init(debug);
        ClientCanister.init(debug);
        ClientCollision.init(debug);
        alt.onServer(EVENT.TO_CLIENT.LOG.CONSOLE, InternalFunctions.handleServerToClientLog);
    }

    static handleServerToClientLog(message: string) {
        alt.log(message);
    }
}

InternalFunctions.init();
