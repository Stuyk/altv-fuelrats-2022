import { deepFreeze } from './utilities';

export const EVENT = {
    TO_CLIENT: {
        LOG: {
            CONSOLE: 'log:console',
        },
        WEBVIEW: {
            SET_URL: `webview:set:url`,
        },
    },
    FROM_WEBVIEW: {
        READY: 'webview:Ready',
    },
};

deepFreeze(EVENT);
