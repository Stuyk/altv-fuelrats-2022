import { deepFreeze } from './utilities';

export const EVENT = {
    TO_CLIENT: {
        LOG: {
            CONSOLE: 'log:console',
        },
        WEBVIEW: {
            SET_URL: `webview:set:url`,
        },
        CANISTER: {
            SPAWN: 'canister:spawn',
        },
        SOUND: {
            FRONTEND: 'sound:frontend:play',
            CUSTOM: 'sound:custom:play',
        },
        MARKER: {
            CREATE: 'marker:create',
            REMOVE: 'marker:remove',
        },
    },
    FROM_WEBVIEW: {
        READY: 'webview:Ready',
    },
    TO_SERVER: {
        COLLISION: {
            EMIT: 'collision:emit',
        },
        POWERUP: {
            USE: 'powerup:use',
        },
    },
};

deepFreeze(EVENT);
