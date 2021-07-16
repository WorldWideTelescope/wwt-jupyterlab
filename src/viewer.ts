// Copyright 2020 AAS WorldWide Telescope
// Licensed under the MIT License

import { JSONObject } from '@lumino/coreutils';

import { Widget } from '@lumino/widgets';

import { classicPywwt } from '@wwtelescope/research-app-messages';

import { WWTLabCommManager } from './comms';

// TODO: make runtime configurable
// XXX: hardcoding "latest"
const IFRAME_URL = 'https://web.wwtassets.org/research/latest/';

export class WWTLabViewer extends Widget {
  private readonly comms: WWTLabCommManager;
  private iframe: HTMLIFrameElement;

  constructor(comms: WWTLabCommManager) {
    super();

    // Set up to receive messages from the iframe that we're about to create.
    // For now we just don't worry about removing the listener :-(
    const iframeOrigin = new URL(IFRAME_URL).origin;

    window.addEventListener(
      'message',
      event => {
        if (event.origin === iframeOrigin) {
          this.onIframeMessage(event.data);
        }
      },
      false
    );

    this.iframe = document.createElement('iframe');
    // Pass our origin so that the iframe can validate the provenance of the
    // messages that are posted to it. This isn't acceptable for real XSS
    // prevention, but so long as the research app can't do anything on behalf
    // of the user (which it can't right now because we don't even have
    // "users"), that's OK.
    this.iframe.src =
      IFRAME_URL + '?origin=' + encodeURIComponent(location.origin);
    this.iframe.style.setProperty('height', '100%', '');
    this.iframe.style.setProperty('width', '100%', '');
    this.node.appendChild(this.iframe);

    this.comms = comms;
    comms.onAnyMessage = this.processCommMessage;
  }

  private onIframeMessage(msg: any): void {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    this.comms.broadcastMessage(msg as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  private readonly processCommMessage = (d: JSONObject): void => {
    const window = this.iframe.contentWindow;
    if (window) {
      classicPywwt.applyBaseUrlIfApplicable(d, location.toString());
      window.postMessage(d, IFRAME_URL);
    }
  };
}
