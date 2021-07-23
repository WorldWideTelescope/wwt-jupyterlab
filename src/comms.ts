// Copyright 2020-2021 the .NET Foundation
// Licensed under the MIT License.

/** It took me SO LONG to get something to work reliably here. I wanted to
 * connect to kernels using KernelManagers or SessionManagers, but I could never
 * get reliable comms from a kernel to the frontend. I can't find a way to
 * discover an *existing* notebook connection using the managers, as opposed to
 * creating additional new connections using the connectTo() methods. The
 * problem is that then, we're unable to call registerCommTarget on the primary
 * KernelConnection, leading to errors when trying to set up comms. I feel like
 * I must be doing something wrong, but the approach here seems to actually
 * work.
 */

import { JSONObject } from '@lumino/coreutils';

import { ISessionContext } from '@jupyterlab/apputils';

import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';

import { Kernel, KernelMessage, Session } from '@jupyterlab/services';

import {
  isPingPongMessage,
  PingPongMessage
} from '@wwtelescope/research-app-messages';

class Connection {
  comm: Kernel.IComm;
  kernelThinksAppIsAlive: boolean;

  constructor(comm: Kernel.IComm) {
    this.comm = comm;
    this.kernelThinksAppIsAlive = false;
  }
}

const APP_PING_INTERVAL_MS = 1000;
const APP_PONG_DEADLINE_MS = 2500;

export class WWTLabCommManager {
  private readonly targetName: string;
  private activeComms: Map<string, Connection> = new Map();
  private lastPongTimestamp = 0;

  constructor(targetName: string, notebooks: INotebookTracker) {
    this.targetName = targetName;
    notebooks.widgetAdded.connect((_: INotebookTracker, np: NotebookPanel) =>
      this.monitorPanel(np)
    );
    notebooks.forEach(this.monitorPanel);

    setInterval(this.pingAndCheck, APP_PING_INTERVAL_MS);
  }

  public dataRelayConfirmedAvailable = false;

  private readonly monitorPanel = (panel: NotebookPanel): void => {
    panel.sessionContext.kernelChanged.connect(this.onKernelChanged);

    if (panel.sessionContext.session !== null) {
      panel.sessionContext.session.kernel.registerCommTarget(
        this.targetName,
        this.onCommOpened
      );
    }
  };

  private readonly onKernelChanged = (
    _: ISessionContext,
    { oldValue, newValue }: Session.ISessionConnection.IKernelChangedArgs
  ): void => {
    if (oldValue !== null) {
      oldValue.removeCommTarget(this.targetName, this.onCommOpened);
    }

    if (newValue !== null) {
      newValue.registerCommTarget(this.targetName, this.onCommOpened);
    }
  };

  private readonly onCommOpened = (
    comm: Kernel.IComm,
    msg: KernelMessage.ICommOpenMsg
  ): void => {
    if (msg.content.target_name === this.targetName) {
      this.activeComms.set(comm.commId, new Connection(comm));
      comm.onMsg = this.onCommMessage;
      comm.onClose = (msg: KernelMessage.ICommCloseMsg): void => {
        this.activeComms.delete(comm.commId);
      };

      // Send some startup information to the kernel.
      try {
        comm.send({
          content: { _pywwtExpedite: true },
          type: 'wwt_jupyter_startup_info',
          dataRelayConfirmedAvailable: this.dataRelayConfirmedAvailable
        });
      } catch {
        // Insta-death, I guess?
        this.activeComms.delete(comm.commId);
      }
    }
  };

  private readonly onCommMessage = (msg: KernelMessage.ICommMsgMsg): void => {
    this.onAnyMessage(msg.content.data);
  };

  // intentionally modifiable -- this is how one signs up for notifications
  public onAnyMessage = (d: JSONObject): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

  // This function is called by the viewer when it has received a message from
  // the app. We should distribute it to all connected kernels. The messages
  // themselves include unique IDs that kernels should use to determine which
  // ones they should pay attention to.
  public broadcastMessage(d: JSONObject): void {
    // Special handling: "pong" replies to our ping messages

    if (isPingPongMessage(d) && d.sessionId === this.targetName) {
      const ts = Number(d.threadId);

      if (ts <= 0 || isNaN(ts)) {
        console.warn('wwt-jupyterlab: non-numeric threadId value', d.threadId);
      } else {
        this.lastPongTimestamp = ts;
      }

      return;
    }

    d = Object.assign({ content: {} }, d);
    (d['content'] as any)['_pywwtExpedite'] = true; // eslint-disable-line @typescript-eslint/no-explicit-any

    // OK, this is a generic message.

    const toRemove: string[] = [];

    this.activeComms.forEach((conn: Connection) => {
      try {
        conn.comm.send(d);
      } catch {
        // We can get errors when kernels go away. AFAICT the most
        // robust approach is to deal with this here.
        toRemove.push(conn.comm.commId);
      }
    });

    toRemove.forEach((id: string) => {
      this.activeComms.delete(id);
    });
  }

  // Periodically (1) issue a ping message and (2) see whether we've recently
  // received a "pong". This is only correct way to keep tabs on whether the app
  // viewer is handling messasges, since even if the iframe exists, it may not
  // have booted up, etc.
  private readonly pingAndCheck = (): void => {
    // Send the ping

    const ping: PingPongMessage = {
      type: 'wwt_ping_pong',
      sessionId: this.targetName,
      threadId: '' + Date.now()
    };

    this.onAnyMessage(ping as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    // Have we had a recent pong?

    const appAlive = (Date.now() - this.lastPongTimestamp) < APP_PONG_DEADLINE_MS; // eslint-disable-line prettier/prettier

    // Notify clients of any state changes

    const toRemove: string[] = [];
    const msg = {
      content: { _pywwtExpedite: true },
      type: 'wwt_jupyter_viewer_status',
      alive: appAlive
    };

    this.activeComms.forEach((conn: Connection) => {
      if (conn.kernelThinksAppIsAlive !== appAlive) {
        try {
          conn.comm.send(msg);
          conn.kernelThinksAppIsAlive = appAlive;
        } catch {
          toRemove.push(conn.comm.commId);
        }
      }
    });

    toRemove.forEach((id: string) => {
      this.activeComms.delete(id);
    });
  };
}
