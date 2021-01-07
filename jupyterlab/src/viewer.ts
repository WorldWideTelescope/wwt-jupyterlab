// Copyright 2020 AAS WorldWide Telescope
// Licensed under the MIT License

import {
  Kernel,
  KernelManager,
  KernelMessage,
} from '@jupyterlab/services';

import {
  each
} from '@lumino/algorithm';

import {
  Widget
} from '@lumino/widgets';

import {
  isViewStateMessage,
} from '@wwtelescope/research-app-messages';

// TODO: make runtime configurable
// XXX: hardcoding "latest"
const IFRAME_URL: string = "https://web.wwtassets.org/research/latest/";

export class WWTLabViewer extends Widget {
  constructor(targetName: string) {
    super();

    // Set up to receive messages from the iframe that we're about to create.
    // For now we just don't worry about removing the listener :-(
    const iframe_origin = new URL(IFRAME_URL).origin;

    window.addEventListener('message', (event) => {
      if (event.origin == iframe_origin) {
        this._onIframeMessage(event.data);
      }
    }, false);

    this.iframe = document.createElement('iframe');
    // Pass our origin so that the iframe can validate the provenance of the
    // messages that are posted to it. This isn't acceptable for real XSS
    // prevention, but so long as the research app can't do anything on behalf
    // of the user (which it can't right now because we don't even have
    // "users"), that's OK.
    this.iframe.src = IFRAME_URL + "?origin=" + encodeURIComponent(location.origin);
    this.iframe.style.setProperty('height', '100%', '');
    this.iframe.style.setProperty('width', '100%', '');
    this.node.appendChild(this.iframe);

    this.targetName = targetName;

    this.kernelManager = new KernelManager();
    this.kernelManager.ready.then(() => {
      this.kernelManager.runningChanged.connect(this._onKernelsChanged.bind(this));
      each(this.kernelManager.running(), (model) => this._connectToKernel(model));
    });
  }

  private iframe: HTMLIFrameElement;
  private targetName: string;
  private kernelManager: KernelManager;
  private kernelConnections = new Map<string, Kernel.IKernelConnection>();
  private comm: Kernel.IComm | null = null;

  _onKernelsChanged(_: KernelManager, models: Kernel.IModel[]) {
    models.forEach(model => {
      if (!this.kernelConnections.has(model.id)) {
        this._connectToKernel(model);
      }
    });
  }

  _connectToKernel(model: Kernel.IModel) {
    const conn = this.kernelManager.connectTo({model: model, handleComms: true});
    this.kernelConnections.set(model.id, conn);

    conn.registerCommTarget(this.targetName, (comm, msg) => {
      if (msg.content.target_name !== this.targetName) {
        return;
      }

      this.comm = comm;
      comm.onMsg = this._onCommMessage.bind(this);
      //comm.onClose = this._onCommClose.bind(this);
    });
  }

  _onCommMessage(msg: KernelMessage.ICommMsgMsg) {
    const window = this.iframe.contentWindow;
    if (window) {
      window.postMessage(msg.content.data, IFRAME_URL);
    }
  }

  _onIframeMessage(msg: any) {  // eslint-disable-line @typescript-eslint/no-explicit-any
    if (isViewStateMessage(msg)) {
      // Relay to the client kernel so it knows what's going on.
      if (this.comm !== null) {
        this.comm.send(msg as any);  // eslint-disable-line @typescript-eslint/no-explicit-any
      }
    } else {
      console.warn('WWT JupyterLab viewer got unexpected message from app, as follows:');
      console.warn(msg);
    }
  }
}
