import * as alt from 'alt-server';

export class ServerDeath {
    static init() {
        alt.on('playerDeath', ServerDeath.handle);
    }

    static handle(player: alt.Player) {
        player.spawn(player.pos.x, player.pos.y, player.pos.z);
    }
}
