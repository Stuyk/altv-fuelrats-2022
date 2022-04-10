import * as alt from 'alt-shared';

export interface IMarker {
    uid: string;
    type: number;
    pos: alt.Vector3;
    dir: alt.Vector3;
    rot: alt.Vector3;
    scale: alt.Vector3;
    color: alt.RGBA;
}
