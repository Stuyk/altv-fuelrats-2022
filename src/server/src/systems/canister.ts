import { STREAM_SYNCED_META } from '@fuelrats/core';
import { EVENT } from '@fuelrats/core/src/events';
import * as alt from 'alt-server';
import { CanisterColshape } from '../extensions/colshape';

const TIME_BETWEEN_TRANSFERS = 500;
const CANISTER_RADIUS = 1;
const CANISTER_HEIGHT = 2;

let nextTransferTime = Date.now() + TIME_BETWEEN_TRANSFERS;
let canister: CanisterColshape;
let owner: alt.Player | undefined;
let debug = false;

export class ServerCanister {
    static init(_debug: boolean = false) {
        debug = _debug;

        alt.on('playerDisconnect', (player: alt.Player) => {
            ServerCanister.drop(player);
        });
    }

    static getOwner(): alt.Player | undefined {
        return owner;
    }

    static getOwnerId(): number {
        if (!owner) {
            return -1;
        }

        return owner.id;
    }

    static create(pos: alt.Vector3) {
        owner = undefined;

        if (canister) {
            canister.remove();
        }

        canister = new CanisterColshape(pos, CANISTER_RADIUS, CANISTER_HEIGHT);
        canister.addCallback(ServerCanister.pickup);

        if (debug) {
            alt.log(`[Debug] Creating new canister`);
        }
    }

    static sync(player: alt.Player) {
        if (!owner) {
            alt.emitClient(player, EVENT.TO_CLIENT.CANISTER.SPAWN, canister.pos);

            if (debug) {
                alt.log(`[Debug] ${player.name} - Synchronizing canister for new player.`);
            }
        }
    }

    static pickup(player: alt.Player) {
        if (debug) {
            alt.log(`[Debug] ${player.name} is trying to pickup canister`);
        }

        owner = player;
        player.setStreamSyncedMeta(STREAM_SYNCED_META.PLAYER.HAS_CANISTER, true);
    }

    static drop(player: alt.Player, pos: alt.Vector3 = canister.pos) {
        if (player && player.valid) {
            player.setStreamSyncedMeta(STREAM_SYNCED_META.PLAYER.HAS_CANISTER, false);

            if (player.pos) {
                pos = new alt.Vector3(player.pos.x, player.pos.y, player.pos.z - 1);
            }
        }

        ServerCanister.create(pos);
    }

    static destroy() {
        //
    }

    static transfer(to: alt.Player) {
        if (Date.now() < nextTransferTime) {
            return;
        }

        nextTransferTime = Date.now() + TIME_BETWEEN_TRANSFERS;

        if (owner && owner.id === to.id) {
            alt.logWarning(`Somehow it's the same person...`);
        }

        if (owner) {
            owner.setStreamSyncedMeta(STREAM_SYNCED_META.PLAYER.HAS_CANISTER, false);
        }

        owner = to;
        to.setStreamSyncedMeta(STREAM_SYNCED_META.PLAYER.HAS_CANISTER, true);
    }
}
