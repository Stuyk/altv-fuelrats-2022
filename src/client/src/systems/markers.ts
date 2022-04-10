import { EVENT, IMarker } from '@fuelrats/core';
import * as alt from 'alt-client';
import * as native from 'natives';

let isUpdating = false;
let markers: Array<IMarker> = [];
let debug = false;

export class ClientMarkers {
    static init(_debug: boolean) {
        debug = _debug;
        alt.setInterval(ClientMarkers.tick, 0);
        alt.onServer(EVENT.TO_CLIENT.MARKER.CREATE, ClientMarkers.create);
        alt.onServer(EVENT.TO_CLIENT.MARKER.REMOVE, ClientMarkers.remove);
    }

    static create(marker: IMarker | Array<IMarker>) {
        isUpdating = true;

        if (Array.isArray(marker)) {
            markers = marker;
        } else {
            const index = markers.findIndex((x) => x.uid === marker.uid);
            if (index >= 0) {
                markers[index] = marker;
            } else {
                markers.push(marker);
            }

            if (debug) {
                alt.log(`Created Marker: \r\n ${JSON.stringify(marker, null, '\t')}`);
            }
        }

        isUpdating = false;
    }

    static remove(uid: string) {
        isUpdating = true;

        const index = markers.findIndex((x) => x.uid === uid);
        if (index >= 0) {
            markers.splice(index, 1);
        }

        isUpdating = false;
    }

    static tick() {
        if (isUpdating) {
            return;
        }

        for (let i = 0; i < markers.length; i++) {
            const marker = markers[i];
            ClientMarkers.drawMarker(
                marker.type,
                marker.pos,
                marker.dir,
                marker.rot,
                marker.scale,
                marker.color.r,
                marker.color.g,
                marker.color.b,
                marker.color.a
            );
        }
    }

    static drawMarker(
        type: number,
        pos: alt.Vector3,
        dir: alt.Vector3,
        rot: alt.Vector3,
        scale: alt.Vector3,
        r: number,
        g: number,
        b: number,
        alpha: number
    ) {
        native.drawMarker(
            type,
            pos.x,
            pos.y,
            pos.z,
            dir.x,
            dir.y,
            dir.z,
            rot.x,
            rot.y,
            rot.z,
            scale.x,
            scale.y,
            scale.z,
            r,
            g,
            b,
            alpha,
            false,
            false,
            0,
            false,
            undefined,
            undefined,
            false
        );
    }
}
