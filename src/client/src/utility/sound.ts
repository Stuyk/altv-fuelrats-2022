import { EVENT } from '@fuelrats/core';
import * as native from 'natives';
import * as alt from 'alt-client';

export class FrontendSound {
    static init() {
        alt.onServer(EVENT.TO_CLIENT.SOUND.FRONTEND, FrontendSound.playFrontendSound);
    }

    /**
     * It plays a sound from the frontend
     * @param {string} name - The name of the sound file.
     * @param {string} dictionary - The dictionary to use.
     */
    static playFrontendSound(name: string, dictionary: string) {
        native.playSoundFrontend(-1, name, dictionary, false);
    }
}
