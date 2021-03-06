import { EVENT } from '@fuelrats/core';
import * as alt from 'alt-server';
import { TempColshapeCylinder } from '../extensions/colshape';
import { ServerCanister } from './canister';
import { ServerMarkers } from './markers';
import { ServerRound } from './round';

const GOAL_UID = 'goal';
const GOAL_RADIUS = 3;
const GOAL_HEIGHT = 2;

const callbacks: Array<(winner: alt.Player) => void> = [];
let currentGoal: TempColshapeCylinder;
let pos: alt.Vector3;
let blip: alt.PointBlip;

export class ServerGoal {
    /**
     * The init function takes a callback function as an argument.
     * The callback will be invoked when a goal is scored.
     * @param {Function} _callback - The function to be called when the user clicks the button.
     */
    static addCallback(_callback: (winner: alt.Player) => void) {
        callbacks.push(_callback);
    }

    /**
     * It creates a new cylinder colshape at the given position, and adds a callback to it.
     *
     * The callback is a function that is called when a player enters the colshape.
     *
     * The callback function is called `handleGoal`.
     *
     * Let's take a look at that function.
     * @param _pos - The position of the goal.
     */
    static create(_pos: alt.Vector3) {
        if (currentGoal) {
            currentGoal.remove();
        }

        pos = _pos;
        currentGoal = new TempColshapeCylinder(
            new alt.Vector3(pos.x, pos.y, pos.z - 1),
            GOAL_RADIUS,
            GOAL_HEIGHT,
            GOAL_UID
        );

        currentGoal.addCallback(ServerGoal.handleGoal);
        ServerMarkers.create({
            uid: 'goal',
            pos: new alt.Vector3(pos.x, pos.y, pos.z - 1),
            color: new alt.RGBA(255, 0, 0, 100),
            dir: new alt.Vector3(0, 0, 0),
            rot: new alt.Vector3(0, 0, 0),
            scale: new alt.Vector3(GOAL_RADIUS * 2, GOAL_RADIUS * 2, GOAL_HEIGHT),
            type: 1,
        });
    }

    /**
     * If the player is the owner of the canister and has entered the temporary goal, then run the callbacks
     * @param player - alt.Player - The player who is interacting with the canister.
     * @returns The return value is a boolean.
     */
    static handleGoal(player: alt.Player) {
        if (ServerRound.isUpdating()) {
            return false;
        }

        const owner = ServerCanister.getOwnerId();
        if (owner === -1) {
            return false;
        }

        if (owner !== player.id) {
            return false;
        }

        ServerCanister.drop(false);
        ServerMarkers.remove(GOAL_UID);

        if (callbacks.length >= 1) {
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i](player);
            }
        }

        alt.emitAllClients(EVENT.TO_CLIENT.SOUND.FRONTEND, 'Whistle', 'DLC_TG_Running_Back_Sounds');
        return true;
    }

    /**
     * If the owner is valid, then set the blip position to the owner's position, otherwise set the blip
     * position to the position of the canister.
     * @returns the blip.pos.
     */
    static updateBlipPosition() {
        if (!pos) {
            return;
        }

        if (!blip && pos) {
            blip = new alt.PointBlip(pos.x, pos.y, pos.z);
            blip.sprite = 309; // radar_race
            blip.color = 0; // white
            blip.name = 'Goal';
        }

        if (!blip) {
            return;
        }

        blip.pos = pos;
    }
}
