import * as alt from 'alt-client';

const commands: { [key: string]: Function } = {};

export class Console {
    static init() {
        alt.on('consoleCommand', (name: string) => {
            if (commands[name]) {
                commands[name]();
            }
        });

        Console.registerConsoleCommand('/pos', Console.pos);
    }

    static registerConsoleCommand(name: string, callback: Function) {
        commands[name] = callback;
    }

    static pos() {
        if (alt.Player.local.vehicle) {
            console.log(JSON.stringify(alt.Player.local.vehicle.pos, null, '\t'));
            return;
        }

        console.log(JSON.stringify(alt.Player.local.pos, null, '\t'));
    }
}
