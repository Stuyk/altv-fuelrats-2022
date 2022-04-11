import { EVENT } from '@fuelrats/core';
import * as alt from 'alt-client';
import * as native from 'natives';

interface IWorld {
  weatherId: number;

  time: Partial<{
    hour: number;
    minute: number;
    freezeClock: boolean;
  }>,
  options: Partial<{
    snowLevel: number;
    forceTrails: boolean;

    windSpeed: number;
    windDirection: number;

    freezeClock: boolean;
  }>
};


export class WorldSync {
  static init() {
    alt.onServer('World:sync', this.handleWorldSync);
  }

  static handleWorldSync(world: Partial<IWorld> | undefined) {
    native.setClockDate(1, 1, 2022);
    native.setClockTime(world?.time?.hour ?? 12, world?.time?.minute ?? 0, 0);

    const weatherString = this.weatherIdToWeatherString(world?.weatherId);
    native.setWeatherTypeNowPersist(weatherString);

    // options
    native.setForceVehicleTrails(world?.options?.forceTrails ?? false);
    native.setForcePedFootstepsTracks(world?.options?.forceTrails ?? false);

    if (weatherString == 'XMAS') {
      native.requestScriptAudioBank('ICE_FOOTSTEPS', false, 0);
      native.requestScriptAudioBank('SNOW_FOOTSTEPS', false, 0);
    } else {
      native.releaseNamedScriptAudioBank('ICE_FOOTSTEPS');
      native.releaseNamedScriptAudioBank('SNOW_FOOTSTEPS');
    }

    // We might want to clamp this? - needs testing
    native.setWind(world?.options?.windSpeed ?? 0);
    native.setWindDirection(world?.options?.windDirection ?? 0);

    alt.setMsPerGameMinute(world?.options?.freezeClock ? 999_999_000 : 1500);

  }

  static weatherIdToWeatherString(type: number | undefined) {
    const weathers = [
      'EXTRASUNNY',
      'CLEAR',
      'CLOUDS',
      'SMOG',
      'FOGGY',
      'OVERCAST',
      'RAIN',
      'THUNDER',
      'CLEARING',
      'NEUTRAL',
      'SNOW',
      'BLIZZARD',
      'SNOWLIGHT',
      'XMAS',
      'HALLOWEEN',
    ]

    return weathers[type ?? 0] ?? 'EXTRASUNNY';
  }
}
