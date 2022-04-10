import { EVENT, IMarker } from '@fuelrats/core';
import * as alt from 'alt-server';

const markers: Array<IMarker> = [];

export class ServerMarkers {
    /**
     * If the marker exists, update it, otherwise create it.
     * @param {IMarker} marker - IMarker
     */
    static create(marker: IMarker) {
        const index = markers.findIndex((x) => x.uid === marker.uid);
        if (index >= 0) {
            markers[index] = marker;
        } else {
            markers.push(marker);
        }

        alt.emitAllClients(EVENT.TO_CLIENT.MARKER.CREATE, marker);
    }

    /**
     * If the index of the marker with the given uid is greater than or equal to 0, then remove the
     * marker from the array. Then remove the marker client-side for all players.
     * @param {string} uid - The unique ID of the marker.
     */
    static remove(uid: string) {
        const index = markers.findIndex((x) => x.uid === uid);
        if (index >= 0) {
            markers.splice(index, 1);
        }

        alt.emitAllClients(EVENT.TO_CLIENT.MARKER.REMOVE, uid);
    }

    /**
     * It loops through the markers array and emits the data to the client
     * @param player - alt.Player - The player to send the marker to.
     */
    static sync(player: alt.Player) {
        alt.emitClient(player, EVENT.TO_CLIENT.MARKER.CREATE, markers);
    }
}
