import * as alt from 'alt-client';
import * as native from 'natives';

export class EnterVehicleEvent {
    static init() {
        alt.on('enteredVehicle', EnterVehicleEvent.entered);
    }

    static entered(vehicle: alt.Vehicle, seat: number) {
        native.setPedConfigFlag(alt.Player.local.scriptID, 32, false);
        native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
        native.setPedConfigFlag(alt.Player.local.scriptID, 184, true);
        native.setPedConfigFlag(alt.Player.local.scriptID, 35, false);
        native.pauseClock(true);

        native.setPedComponentVariation(alt.Player.local.scriptID, 4, 34, 0, 2);
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, 25, 0, 2);
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 2);
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, 243, 0, 2);
        native.setPedComponentVariation(alt.Player.local.scriptID, 15, 96, 0, 2);
        native.setPedPropIndex(alt.Player.local.scriptID, 0, 18, 0, true);

        if (alt.Player.local.vehicle) {
            native.setVehicleEngineOn(alt.Player.local.vehicle.scriptID, true, false, false);
        }
    }
}
