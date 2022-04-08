import { EVENT, STREAM_SYNCED_META } from '@fuelrats/core';
import * as alt from 'alt-client';
import * as native from 'natives';

const CANISTER_MODEL = alt.hash('prop_jerrycan_01a');
let id: number;
let debug = false;

export class ClientCanister {
    static init(_debug = false) {
        debug = _debug;
        alt.on('gameEntityCreate', ClientCanister.create);
        alt.on('gameEntityDestroy', ClientCanister.detach);
        alt.on('streamSyncedMetaChange', ClientCanister.streamSyncedMetaChange);
        alt.onServer(EVENT.TO_CLIENT.CANISTER.SPAWN, ClientCanister.spawn);
        alt.on('disconnect', ClientCanister.delete);
    }

    private static delete() {
        if (id) {
            native.deleteEntity(id);
        }
    }

    static spawn(pos: alt.Vector3) {
        if (id === undefined || id === null) {
            id = native.createObjectNoOffset(CANISTER_MODEL, pos.x, pos.y, pos.z, false, false, false);
            native.freezeEntityPosition(id, true);

            if (debug) {
                alt.log(`[Debug] Created Canister`);
            }
        }

        if (debug) {
            alt.log(`[Debug] Spawned Canister`);
        }

        native.setEntityCollision(id, false, false);
        native.detachEntity(id, false, false);
        native.freezeEntityPosition(id, true);
        native.setEntityCoordsNoOffset(id, pos.x, pos.y, pos.z, false, false, false);
    }

    /**
     * This function is called when a vehicle or player enters the stream range.
     * @param entity
     */
    static create(entity: alt.Entity) {
        if (!(entity instanceof alt.Player)) {
            return;
        }

        const hasCanister = entity.getStreamSyncedMeta(STREAM_SYNCED_META.PLAYER.HAS_CANISTER);
        if (!hasCanister) {
            return;
        }

        if (!entity.vehicle) {
            return;
        }

        if (id === undefined || id === null) {
            id = native.createObjectNoOffset(
                CANISTER_MODEL,
                entity.pos.x,
                entity.pos.y,
                entity.pos.z,
                false,
                false,
                false
            );
        }

        native.freezeEntityPosition(id, true);
        native.setEntityCollision(id, false, false);
        native.attachEntityToEntity(
            id,
            entity.vehicle.scriptID,
            0,
            0,
            0,
            2,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            false
        );
    }

    /**
     * This function is called when a vehicle or player leaves the stream range.
     * @param entity
     */
    static detach(entity: alt.Entity) {
        if (!(entity instanceof alt.Player)) {
            return;
        }

        if (id !== undefined && id !== null) {
            native.detachEntity(id, false, false);
            native.freezeEntityPosition(id, true);
        }
    }

    /**
     * If the player has a canister, create a canister for the player
     * Otherwise, transfer the canister to another player.
     * @param entity - alt.Entity - The entity that the meta is being changed on.
     * @param {string} key - string - The key of the meta that changed.
     * @param {any} value - The new value of the meta.
     * @param {any} oldValue - The old value of the meta.
     * @returns The return value is the value of the last expression evaluated.
     */
    static streamSyncedMetaChange(entity: alt.Entity, key: string, value: any, oldValue: any) {
        if (!(entity instanceof alt.Player)) {
            return;
        }

        if (key !== STREAM_SYNCED_META.PLAYER.HAS_CANISTER) {
            return;
        }

        if (!value) {
            native.detachEntity(id, false, false);
            native.freezeEntityPosition(id, true);
        }

        if (value) {
            ClientCanister.create(entity);
        }
    }
}
