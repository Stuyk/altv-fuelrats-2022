import { IMap } from '@fuelrats/core';
import * as alt from 'alt-server';

import { InnerCityMap } from '../maps/innerCity';

const MAP_POOL = [InnerCityMap];

const VALID_VEHICLES = [
    'rhapsody',
    'weevil',
    'police2',
    'police3',
    'dominator',
    'karby',
    'yosemite2',
    'bfinjection',
    'brawler',
    'kamacho',
    'sandking',
    'trophytruck',
    'alpha',
    'banshee',
    'blista2',
    'buffalo',
    'comet2',
    'elegy',
    'drafter',
    'elegy2',
    'flashgt',
    'coquette',
    'hotring',
    'furoregt',
    'jester',
    'issi7',
    'imorgen',
    'gb200',
    'khamelion',
    'jugular',
    'komoda',
    'kuruma',
    'locust',
    'lynx',
    'neo',
    'ninef',
    'neon',
    'omnis',
    'paragon',
    'pariah',
    'penumbra',
    'raiden',
    'rapidgt',
    'raptor',
    'seven70',
    'sultan',
    'surano',
    'tropos',
    'ardent',
    'casco',
    'cheetah2',
    'infernus2',
    'retinue2',
    'stingergt',
    'torero',
    'zion3',
    'adder',
    'bullet',
    'cyclone',
    'emerus',
    'entityxf',
    'gp1',
    'fmj',
    'osiris',
    'reaper',
    'sheava',
    'sultanrs',
    'thrax',
    'tigon',
    'vacca',
    'tempesta',
    't20',
    'visione',
    'voltic',
    'xa21',
    'zentorno',
    'squaddie',
];

let map: IMap;
let mapIndex = -1;
let currentRound = 0;
let currentVehicleIndex = 0;

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

        // Update all player's world related stuff.
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

    static randomizeVehicle() {
        currentVehicleIndex = Math.floor(Math.random() * VALID_VEHICLES.length);
    }

    static getVehicle(): string {
        return VALID_VEHICLES[currentVehicleIndex];
    }

    static sync(player: alt.Player) {
        player.emit('World:sync', map.world);
    }
}
