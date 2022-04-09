import { EVENT } from '@fuelrats/core';
import * as alt from 'alt-client';
import * as native from 'natives';

let disabledControls: Array<{ control: number; syncedMetaName: string; callback: Function }> = [];

export class PowerUp {
    static init() {
        alt.setInterval(PowerUp.tick, 0);
    }

    private static tick() {
        if (!alt.Player.local.vehicle) {
            return;
        }

        for (let i = 0; i < disabledControls.length; i++) {
            native.disableControlAction(0, disabledControls[i].control, true);
            if (!native.isDisabledControlJustReleased(0, disabledControls[i].control)) {
                continue;
            }

            alt.log(1);

            const isAvailable = alt.Player.local.getSyncedMeta(disabledControls[i].syncedMetaName);
            if (!isAvailable) {
                continue;
            }

            alt.log(2);

            disabledControls[i].callback();
            alt.emitServer(EVENT.TO_SERVER.POWERUP.USE, disabledControls[i].syncedMetaName);
        }
    }

    static registerPowerUp(control: number, syncedMetaName: string, callback: Function) {
        const index = disabledControls.findIndex((x) => x.control === control);
        if (index >= 0) {
            throw new Error(`${control} is already a registered control.`);
        }

        disabledControls.push({ control, syncedMetaName, callback });
    }
}
