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

export interface IMap {
    maxScore: number;
    roundTimer: number;
    world?: Partial<{
        weatherId: number;

        time: Partial<{
            hour: number;
            minute: number;
            freezeClock: boolean;
        }>,
        options: Partial<{
            snowLevel: number;
            forceTrails: boolean;

            windSpeed: number;
            windDirection: number;

            freezeClock: boolean;
        }>
    }>,
    spawn: alt.Vector3;
    canisters: Array<alt.IVector3 | alt.Vector3>;
    goals: Array<alt.IVector3 | alt.Vector3>;
}
