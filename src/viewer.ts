// Copyright 2020-2021 AAS WorldWide Telescope
// Licensed under the MIT License

import { JSONObject } from '@lumino/coreutils';

import { Widget } from '@lumino/widgets';

import { classicPywwt } from '@wwtelescope/research-app-messages';

import { WWTLabCommManager } from './comms';

export class WWTLabViewer extends Widget {
  private readonly comms: WWTLabCommManager;
  private appOrigin: string;
  private iframe: HTMLIFrameElement;

  constructor(comms: WWTLabCommManager, appUrl: string) {
    super();

    // Set up to receive messages from the iframe that we're about to create.
    // For now we just don't worry about removing the listener :-(
    this.appOrigin = new URL(appUrl, location.toString()).origin;

    window.addEventListener(
      'message',
      (event) => {
        if (event.origin === this.appOrigin) {
          this.onIframeMessage(event.data);
        }
      },
      false
    );

    this.comms = comms;

    this.iframe = document.createElement('iframe');
    // Pass our origin so that the iframe can validate the provenance of the
    // messages that are posted to it. This isn't acceptable for real XSS
    // prevention, but so long as the research app can't do anything on behalf
    // of the user (which it can't right now because we don't even have
    // "users"), that's OK.
    this.iframe.src = appUrl + '?origin=' + encodeURIComponent(location.origin);
    this.iframe.style.setProperty('height', '100%', '');
    this.iframe.style.setProperty('width', '100%', '');

    // Various permissions. Some of these aren't currently used but might be in
    // the future.
    this.iframe.setAttribute('allowFullScreen', '');
    this.iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; gyroscope'
    );

    // Don't start trying to process messages until the iframe is loaded.
    // Otherwise we can get an error where our postMessage goes to the wrong
    // place.
    this.iframe.addEventListener('load', () => {
      comms.onAnyMessage = this.processCommMessage;
    });

    this.node.appendChild(this.iframe);
  }

  private onIframeMessage(msg: any): void {
    // Relaying pointer move and up events to parent elements to allow drag
    // operations over the iframe. For example, when moving windows inside
    // jupyter lab.
    if (msg.type === 'wwt_pointer_move' || msg.type === 'wwt_pointer_up') {
      const boundingClientRect = this.iframe.getBoundingClientRect();
      // Jupyter lab seems to not listen to pointer events, so we use mouse
      // events instead.
      const mouseEvent = new MouseEvent(
        msg.type === 'wwt_pointer_move' ? 'mousemove' : 'mouseup',
        {
          bubbles: true,
          cancelable: false,
          clientX: msg.clientX + boundingClientRect.left,
          clientY: msg.clientY + boundingClientRect.top,
        }
      );

      this.iframe.dispatchEvent(mouseEvent);
    } else {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      this.comms.broadcastMessage(msg as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    }
  }

  private readonly processCommMessage = (d: JSONObject): void => {
    const window = this.iframe.contentWindow;
    if (window) {
      classicPywwt.applyBaseUrlIfApplicable(d, location.toString());
      window.postMessage(d, this.appOrigin);
    }
  };
}
