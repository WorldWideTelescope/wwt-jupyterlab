// Copyright 2020 the .NET Foundation
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

export class WWTLabCommManager {
  private readonly targetName: string;
  private activeComms: Map<string, Kernel.IComm> = new Map();

  constructor(targetName: string, notebooks: INotebookTracker) {
    this.targetName = targetName;
    notebooks.widgetAdded.connect((_: INotebookTracker, np: NotebookPanel) =>
      this.monitorPanel(np)
    );
    notebooks.forEach(this.monitorPanel);
  }

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
      this.activeComms.set(comm.commId, comm);
      comm.onMsg = this.onCommMessage;
      comm.onClose = (msg: KernelMessage.ICommCloseMsg): void => {
        this.activeComms.delete(comm.commId);
      };
    }
  };

  private readonly onCommMessage = (msg: KernelMessage.ICommMsgMsg): void => {
    this.onAnyMessage(msg.content.data);
  };

  // intentionally modifiable -- this is how one signs up for notifications
  public onAnyMessage = (d: JSONObject): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

  public broadcastMessage(d: JSONObject): void {
    const toRemove: string[] = [];

    this.activeComms.forEach((comm: Kernel.IComm) => {
      try {
        comm.send(d);
      } catch {
        // We can get errors when kernels go away. AFAICT the most
        // robust approach is to deal with this here.
        toRemove.push(comm.commId);
      }
    });

    toRemove.forEach((id: string) => {
      this.activeComms.delete(id);
    });
  }
}
