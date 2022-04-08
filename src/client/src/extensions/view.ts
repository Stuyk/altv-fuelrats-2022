import * as native from 'natives';
import * as alt from 'alt-client';
import { EVENT } from '@fuelrats/core';

let _isReady: boolean = false;
let _webview: alt.WebView;
let _currentEvents: { eventName: string; callback: any }[] = [];
let _cursorCount: number = 0;

export class WebViewController {
    static init() {
        alt.onServer(EVENT.TO_CLIENT.WEBVIEW.SET_URL, WebViewController.create);
    }

    /**
     * "If the url contains localhost or 127.0.0.1, then log a warning to the console. If the webview
     * is not already created, then create a new webview with the url and set the isReady variable to
     * true."
     * 
     * The next function is the one that is called when the player clicks the button.
     * @param {string} url - The URL of the website you want to use.
     */
    static create(url: string) {
        if (url.includes('localhost') || url.includes('127.0.0.1')) {
            alt.logWarning(`Running WebService in Development Mode. Nobody can see these pages but the host computer.`);
        }

        if (!_webview) {
            _webview = new alt.WebView(url, false);
            _webview.on(EVENT.FROM_WEBVIEW.READY, () => {
                _isReady = true;
            });
        }
    }

    /**
     * Get the current WebView instance.
     * @static
     * @return {Promise<alt.WebView>}
     * @memberof WebViewController
     */
    static async get(): Promise<alt.WebView> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!_webview) {
                    return;
                }

                if (!_isReady) {
                    return;
                }

                alt.clearInterval(interval);
                return resolve(_webview);
            }, 100);
        });
    }

    /**
     * Destroy the WebView
     * @static
     * @memberof WebViewController
     */
    static dispose() {
        _webview.destroy();
    }

    /**
     * Unbinds events from the WebView. Mostly useless.
     * @static
     * @param {string} eventName
     * @param {(...args: any[]) => void} listener
     * @return {*}
     * @memberof WebViewController
     */
    static async off(eventName: string, listener: (...args: any[]) => void) {
        const view = await WebViewController.get();
        view.off(eventName, listener);

        const index = _currentEvents.findIndex((x) => x.eventName === eventName);
        if (index <= -1) {
            return;
        }

        _currentEvents.splice(index, 1);
    }

    /**
     * Emit an event to the WebView.
     * @static
     * @param {string} eventName
     * @param {...any[]} args
     * @memberof WebViewController
     */
    static async emit(eventName: string, ...args: any[]) {
        const view = await WebViewController.get();
        view.emit(eventName, ...args);
    }

    /**
     * Focus the WebView Instance
     * @static
     * @memberof WebViewController
     */
    static async focus() {
        const view = await WebViewController.get();
        view.focus();
    }

    /**
     * Focus the WebView Instance
     * @static
     * @memberof WebViewController
     */
    static async unfocus() {
        const view = await WebViewController.get();
        view.unfocus();
    }

    /**
     * Show or hide the cursor.
     * @static
     * @param {boolean} state
     * @memberof WebViewController
     */
    static async showCursor(state: boolean) {
        if (state) {
            _cursorCount += 1;
            try {
                alt.showCursor(true);
            } catch (err) {}
        } else {
            for (let i = 0; i < _cursorCount; i++) {
                try {
                    alt.showCursor(false);
                } catch (err) {}
            }

            _cursorCount = 0;
        }
    }
}
