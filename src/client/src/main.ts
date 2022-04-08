import * as alt from 'alt-client';
import { EVENT } from '@fuelrats/core';
import { WebViewController } from './extensions/view';

class InternalFunctions {
    static init() {
        WebViewController.init();
        alt.onServer(EVENT.TO_CLIENT.LOG.CONSOLE, InternalFunctions.handleServerToClientLog);
    }

    static handleServerToClientLog(message: string) {
        alt.log(message);
    }
}

InternalFunctions.init();
