import * as alt from 'alt-server';
import { IMap } from '@fuelrats/core';
import { InnerCityMap } from '../maps/innerCity';

const MAP_POOL = [InnerCityMap];

let map: IMap;
let mapIndex = -1;
let currentRound = 0;

export class ServerMap {
    static nextMap() {
        if (map) {
            return;
        }

        currentRound = 0;
        mapIndex += 1;
        if (mapIndex >= MAP_POOL.length) {
            mapIndex = 0;
        }

        ServerMap.loadMap(MAP_POOL[mapIndex]);

        // Update all player's atmosphere and weather.
        alt.Player.all.forEach((player) => {
            ServerMap.sync(player);
        });
    }

    static loadMap(_map: IMap) {
        map = _map;
    }

    static getCanister(): alt.Vector3 | alt.IVector3 {
        return map.canisters[Math.floor(Math.random() * map.canisters.length)];
    }

    static getGoal(): alt.Vector3 | alt.IVector3 {
        return map.goals[Math.floor(Math.random() * map.goals.length)];
    }

    static getSpawn(): alt.Vector3 | alt.IVector3 {
        return map.spawn;
    }

    static getMaxScore(): number {
        return map.maxScore;
    }

    static getRoundTime(): number {
        return map.roundTimer;
    }

    static sync(player: alt.Player) {
        player.setDateTime(
            1,
            1,
            2022,
            map.atmosphere.hour as alt.DateTimeHour,
            map.atmosphere.minute as alt.DateTimeHour,
            0 as alt.DateTimeHour
        );

        player.setWeather(map.atmosphere.weather);
    }
}
