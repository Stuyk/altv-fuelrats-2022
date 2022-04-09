import { STREAM_SYNCED_META } from '@fuelrats/core';
import { EVENT } from '@fuelrats/core/src/events';
import * as alt from 'alt-server';
import { TempColshapeCylinder } from '../extensions/colshape';

const TIME_BETWEEN_TRANSFERS = 500;
const CANISTER_RADIUS = 2;
const CANISTER_HEIGHT = 3;

let isUpdating = false;
let nextTransferTime = Date.now() + TIME_BETWEEN_TRANSFERS;
let canister: TempColshapeCylinder;
let pos: alt.Vector3 | undefined;
let owner: alt.Player | undefined;
let debug = false;
let blip: alt.PointBlip | undefined;

export class ServerCanister {
    static init(_debug: boolean = false) {
        debug = _debug;
        alt.setInterval(ServerCanister.checkCanister, 20);
    }

    /**
     * This function returns the owner of the vehicle, if the owner is undefined, it returns undefined.
     * @returns The owner of the vehicle.
     */
    static getOwner(): alt.Player | undefined {
        return owner;
    }

    static checkCanister() {
        if (owner && !owner.valid) {
            isUpdating = true;
            ServerCanister.drop();
        }
    }

    /**
     * If the owner is not null, return the owner's id. Otherwise, return -1.
     * @returns The id of the owner.
     */
    static getOwnerId(): number {
        if (!owner || !owner.valid) {
            return -1;
        }

        return owner.id;
    }

    /**
     * If the owner is valid, then set the blip position to the owner's position, otherwise set the blip
     * position to the position of the canister.
     * @returns the blip.pos.
     */
    static updateBlipPosition() {
        if (isUpdating) {
            return;
        }

        if (!pos && !owner) {
            return;
        }

        if (!blip && pos) {
            blip = new alt.PointBlip(pos.x, pos.y, pos.z);
            blip.sprite = 361; // radar_jerry_can
            blip.color = 1; // red
            blip.name = 'Canister';
            blip.bright = true;
            blip.pulse = true;
        }

        if (!blip) {
            return;
        }

        if (owner && owner.valid && owner.pos) {
            blip.pos = owner.pos;
            pos = owner.pos;
            return;
        }

        blip.pos = pos as alt.Vector3;
    }

    /**
     * This function creates a new canister at the specified position.
     * @param _pos - alt.Vector3 - The position of the canister
     */
    static create(_pos: alt.Vector3) {
        isUpdating = true;
        owner = undefined;
        pos = _pos;

        if (canister) {
            canister.remove();
        }

        canister = new TempColshapeCylinder(_pos, CANISTER_RADIUS, CANISTER_HEIGHT, 'canister');
        canister.addCallback(ServerCanister.pickup);
        isUpdating = false;

        if (debug) {
            alt.log(`[Debug] Creating new canister`);
        }
    }

    /**
     * If the canister is not owned, emit the canister's position to the player.
     * @param player - alt.Player - The player that is being synchronized with the canister.
     */
    static sync(player: alt.Player) {
        if (!player || !player.valid) {
            return;
        }

        alt.log(player);

        alt.emitClient(player, EVENT.TO_CLIENT.CANISTER.SPAWN, canister.pos, owner?.valid ? owner : undefined);

        if (debug) {
            alt.log(`[Debug] ${player.name} - Synchronizing canister for new player.`);
        }
    }

    /**
     * Set the owner to the player, and set the player's stream synced meta to true.
     * @param player - alt.Player - The player that is trying to pickup the canister.
     */
    static pickup(player: alt.Player) {
        if (isUpdating) {
            return;
        }

        isUpdating = true;
        if (debug) {
            alt.log(`[Debug] ${player.name} is trying to pickup canister`);
        }

        owner = player;
        player.setStreamSyncedMeta(STREAM_SYNCED_META.PLAYER.HAS_CANISTER, true);
        isUpdating = false;
    }

    static drop() {
        owner = undefined;
        ServerCanister.create(pos as alt.Vector3);
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
