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
    },
    FROM_WEBVIEW: {
        READY: 'webview:Ready',
    },
    TO_SERVER: {
        COLLISION: {
            EMIT: 'collision:emit',
        },
    },
};

deepFreeze(EVENT);
