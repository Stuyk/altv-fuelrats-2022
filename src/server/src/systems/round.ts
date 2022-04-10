import * as alt from 'alt-server';
import { PlayerVehicle } from '../extensions/vehicle';
import { ServerCanister } from './canister';
import { ServerGoal } from './goal';
import { ServerMap } from './map';

let debug = false;
let roundFinishTime: number;
let scores: { [key: string]: number } = {};

export class ServerRound {
    static init(_debug = false) {
        debug = _debug;

        // When a goal is scored, called the start function to reset the roud.
        ServerGoal.addCallback(ServerRound.next);

        // Initialize the map loading sequence...
        ServerMap.nextMap();

        // Start the first round...
        ServerRound.next(null);
    }

    static next(winner: alt.Player | null) {
        if (winner) {
            if (!scores[winner.id]) {
                scores[winner.id] = 1;
            } else {
                scores[winner.id] += 1;
            }

            if (scores[winner.id] >= ServerMap.getMaxScore()) {
                scores = {};

                // Announce Winner
                ServerMap.nextMap();

                // Increment to Next Round
                ServerRound.next(null);
                return;
            }
        }

        const canister = ServerMap.getCanister();
        const goal = ServerMap.getGoal();
        const spawn = ServerMap.getSpawn();

        roundFinishTime = Date.now() + ServerMap.getRoundTime();

        ServerCanister.create(new alt.Vector3(canister.x, canister.y, canister.z));
        ServerGoal.create(new alt.Vector3(goal.x, goal.y, goal.z));

        alt.Player.all.forEach((player) => {
            if (!player.vehicle) {
                return;
            }

            player.vehicle.pos = new alt.Vector3(spawn.x, spawn.y, spawn.z);
        });

        // Start countdown here...
    }

    static async sync(player: alt.Player) {
        const spawn = ServerMap.getSpawn();

        new PlayerVehicle(player, 'infernus', new alt.Vector3(spawn.x, spawn.y, spawn.z));

        await new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!player.vehicle) {
                    return;
                }

                resolve();
                alt.clearInterval(interval);
            }, 100);
        });

        if (!player.vehicle) {
            return;
        }

        player.vehicle.pos = new alt.Vector3(spawn.x, spawn.y, spawn.z);
    }
}
