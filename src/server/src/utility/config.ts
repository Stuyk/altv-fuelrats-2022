import * as alt from 'alt-server';
import net from 'net';
import fs from 'fs';

const envPrefix = 'env:';
const validEnvironments = [`dev`, `devtest`, `prod`];
const defaultWebviewURL = `http://assets/webview/index.html`;
const defaultViteServer = '127.0.0.1';
const defaultVitePort = 3000;

type Environment = `dev` | `devtest` | `prod`;

let currentEnvironment: null | Environment = null;

export class ConfigHelper {
    /**
     * It reads server.cfg, checks if it contains an env property, and if it does, it checks if it contains
     * a valid environment string and returns that string.
     * @returns The environment that the server is currently running in.
     */
    static getEnvironment(): Environment | null {
        if (currentEnvironment) {
            return currentEnvironment as Environment;
        }

        const config = fs.readFileSync('server.cfg').toString();
        if (!config.includes(envPrefix)) {
            return null;
        }

        let envResult = null;

        for (let i = 0; i < validEnvironments.length; i++) {
            if (config.includes(`${envPrefix} '${validEnvironments[i]}'`)) {
                currentEnvironment = validEnvironments[i] as Environment;
                break;
            }

            if (config.includes(`${envPrefix} "${validEnvironments[i]}"`)) {
                currentEnvironment = validEnvironments[i] as Environment;
                break;
            }

            continue;
        }

        if (currentEnvironment === 'dev') {
            try {
                const sock = net.createConnection(defaultVitePort, defaultViteServer, () => {
                    alt.logWarning(`Server running with Vue Debug mode on.`);
                    alt.logWarning(`Open http://localhost:3000 in your browser`);
                    alt.logWarning(`Only a local player may connect.`);
                    alt.logWarning(`Server MUST be running on a local computer`);
                    sock.destroy();
                });
            } catch (err) {
                alt.logWarning(``);
            }
        }

        return currentEnvironment;
    }

    /**
     * If the current environment is dev, return the default vite server and port, otherwise return the
     * default webview URL.
     * @returns The webview path for loading client-side.
     */
    static getWebviewPath() {
        if (!currentEnvironment) {
            ConfigHelper.getEnvironment();
        }

        if (currentEnvironment === 'dev') {
            return `http://${defaultViteServer}:${defaultVitePort}`;
        }

        return defaultWebviewURL;
    }
}
