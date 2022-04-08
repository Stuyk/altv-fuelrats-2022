import * as alt from 'alt-server';

const DRIVER_SEAT = 1;

export class PlayerVehicle extends alt.Vehicle {
    private owner: number;

    /**
     * This function is a constructor for the Vehicle class. It takes in an id, type, position, and
     * rotation. It then sets the owner of the vehicle to the id, sets the engineOn to true, and sets
     * the owner into the vehicle.
     * @param {number} id - number - The player's id
     * @param {string} type - The vehicle model name.
     * @param position - alt.Vector3, rotation: alt.Vector3 = new alt.Vector3(0, 0, 0)
     * @param rotation - alt.Vector3 = new alt.Vector3(0, 0, 0)
     * @returns The vehicle itself.
     */
    constructor(
        player: alt.Player,
        type: string,
        position: alt.Vector3,
        rotation: alt.Vector3 = new alt.Vector3(0, 0, 0)
    ) {
        super(type, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z);

        player.model = 'mp_m_freemode_01';
        player.spawn(position.x, position.y, position.z, 0);

        this.owner = player.id;
        this.engineOn = true;
        this.setOwnerIntoVehicle();
        this.manualEngineControl = true;
        this.customPrimaryColor = new alt.RGBA(255, 192, 203, 255);
        this.customSecondaryColor = new alt.RGBA(255, 192, 203, 255);
        return this;
    }

    /**
     * It removes the vehicle from the game
     */
    remove() {
        try {
            this.destroy();
        } catch (err) {}

        alt.logWarning(`Player with ID ${this.owner} has left and the vehicle was removed.`);
    }

    /**
     * This function returns the owner of the current object.
     * @returns The owner property of the object.
     */
    getOwnerIdentifier(): number {
        return this.owner;
    }

    /**
     * It returns the owner of the vehicle, if the owner is not found, it destroys the vehicle.
     * @returns The owner of the vehicle.
     */
    getOwner(): alt.Player | null {
        const owner = alt.Player.all.find((x) => x.id === this.owner);
        if (!owner) {
            this.remove();
            return null;
        }

        return owner;
    }

    /**
     * If the owner is not null, set the owner into the vehicle
     */
    setOwnerIntoVehicle() {
        alt.nextTick(() => {
            const owner = this.getOwner();
            if (!owner) {
                this.remove();
                return;
            }

            this.engineOn = true;
            owner.setIntoVehicle(this, DRIVER_SEAT);
        });
    }
}

// Handles removing the vehicle on player disconnect
alt.on('playerDisconnect', (player: alt.Player) => {
    const id = player.id;
    const vehicles = [...alt.Vehicle.all] as Array<PlayerVehicle>;
    for (let i = 0; i < vehicles.length; i++) {
        if (vehicles[i].getOwnerIdentifier() === id) {
            vehicles[i].remove();
            break;
        }
    }
});

// Handles forcing the player back into the vehicle if they leave it
alt.on('playerLeftVehicle', (player: alt.Player, vehicle: alt.Vehicle) => {
    if (!player || !player.valid) {
        return;
    }

    vehicle.engineOn = true;
    player.pos = player.pos; // Used to work around setting into vehicle twice bug.
    player.setIntoVehicle(vehicle, DRIVER_SEAT);
});
