import { EVENT } from '@fuelrats/core';
import * as alt from 'alt-server';
import { TempColshapeCylinder } from '../extensions/colshape';
import { ServerCanister } from './canister';

const GOAL_RADIUS = 3;
const GOAL_HEIGHT = 2;

const callbacks: Array<Function> = [];
let currentGoal: TempColshapeCylinder;
let pos: alt.Vector3;
let blip: alt.PointBlip;

export class ServerGoal {
    /**
     * The init function takes a callback function as an argument.
     * The callback will be invoked when a goal is scored.
     * @param {Function} _callback - The function to be called when the user clicks the button.
     */
    static init(_callback: Function) {
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
        currentGoal = new TempColshapeCylinder(_pos, GOAL_RADIUS, GOAL_HEIGHT, 'goal');
        currentGoal.addCallback(ServerGoal.handleGoal);
    }

    /**
     * If the player is the owner of the canister and has entered the temporary goal, then run the callbacks
     * @param player - alt.Player - The player who is interacting with the canister.
     * @returns The return value is a boolean.
     */
    static handleGoal(player: alt.Player) {
        const owner = ServerCanister.getOwnerId();
        if (owner === -1) {
            return false;
        }

        if (owner !== player.id) {
            return false;
        }

        if (callbacks.length >= 1) {
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i]();
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
