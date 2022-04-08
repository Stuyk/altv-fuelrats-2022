import { EVENT } from '@fuelrats/core/src/events';
import * as alt from 'alt-server';
import { CanisterColshape } from '../extensions/colshape';

const CANISTER_RADIUS = 1;
const CANISTER_HEIGHT = 2;

let canister: CanisterColshape;
let owner: alt.Player;
let debug = false;

export class ServerCanister {
    static init(_debug: boolean = false) {
        debug = _debug;

        alt.on('playerDisconnect', ServerCanister.drop);
    }

    static create(pos: alt.Vector3) {
        if (canister) {
            canister.remove();
        }

        canister = new CanisterColshape(pos, CANISTER_RADIUS, CANISTER_HEIGHT);
        canister.addCallback(ServerCanister.pickup);

        alt.emitAllClients(EVENT.TO_CLIENT.CANISTER.SPAWN, pos);
    }

    static sync(player: alt.Player) {
        if (!owner) {
            alt.emitClient(player, EVENT.TO_CLIENT.CANISTER.SPAWN, canister.pos);
        }
    }

    static pickup(player: alt.Player) {
        alt.log(`${player.name} is trying to pickup canister`);
    }

    static drop(player: alt.Player) {
        //
    }

    static destroy() {
        //
    }

    static transfer() {
        //
    }
}
