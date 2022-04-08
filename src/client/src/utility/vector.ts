import * as alt from 'alt-client';
import { Vector3 } from 'alt-shared';
import * as native from 'natives';

export function getForwardVector(entity: number, offset: Vector3 = new alt.Vector3(2, 2, 0)) {
    const pos = native.getEntityCoords(entity, false);
    const fwd = native.getEntityForwardVector(entity);
    return new alt.Vector3(pos.x + fwd.x * offset.x, pos.y + fwd.y * offset.y, pos.z + fwd.z * offset.z);
}
