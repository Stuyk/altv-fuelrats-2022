import * as alt from 'alt-server';

export class TempColshapeCylinder extends alt.ColshapeCylinder {
    id: null | undefined | string;
    private enterBind;
    private callback: ((player: alt.Player) => void) | undefined;

    constructor(pos: alt.Vector3, radius: number, height: number, id: string) {
        super(pos.x, pos.y, pos.z, radius, height);
        this.id = id;
        this.enterBind = this.handleEnterShape.bind(this);
        alt.on('entityEnterColshape', this.enterBind);
        return this;
    }

    /**
     * It takes a function as a parameter and assigns it to the callback variable
     * @param callback - The function that will be called when the event is triggered.
     */
    addCallback(callback: (player: alt.Player) => void) {
        this.callback = callback;
    }

    /**
     * Used to fully delete this ColShape.
     * Should be used in place of destroy.
     *
     * @memberof TempColshapeCylinder
     */
    remove() {
        alt.off('entityEnterColshape', this.enterBind);

        try {
            this.destroy();
        } catch (err) {}
    }

    /**
     * If the entity is a player, and the colshape is a canister, and the id of the colshape is
     * canister, then turn off the entityEnterColshape event, and if the callback is defined, then run
     * the callback with the entity as the parameter.
     * @param colshape - alt.Colshape - The colshape that the player entered.
     * @param entity - alt.Entity - The entity that entered the colshape.
     * @returns the entity that entered the colshape.
     */
    private handleEnterShape(colshape: alt.Colshape, entity: alt.Entity) {
        let player: alt.Player | undefined | null = null;

        if (entity instanceof alt.Vehicle && entity.driver && entity.driver.valid) {
            player = alt.Player.all.find((x) => `${x.id}` === `${entity.driver?.id}`);
        }

        if (entity instanceof alt.Player && entity.valid) {
            player = entity as alt.Player;
        }

        if (player === null || player === undefined) {
            return;
        }

        if (!player.valid || !player.vehicle) {
            return;
        }

        if (!(colshape instanceof TempColshapeCylinder)) {
            return;
        }

        if (!colshape.id || colshape.id !== 'canister') {
            return;
        }

        if (!this.callback) {
            return;
        }

        this.remove();
        this.callback(player);
    }
}
