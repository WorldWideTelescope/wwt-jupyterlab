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

import {
  JSONObject,
} from '@lumino/coreutils';

import {
  ISessionContext,
} from '@jupyterlab/apputils';

import {
  INotebookTracker,
  NotebookPanel,
} from '@jupyterlab/notebook';

import {
  Kernel,
  KernelMessage,
  Session,
} from '@jupyterlab/services';

export class WWTLabCommManager {
  private readonly targetName: string;
  private activeComms: Map<string, Kernel.IComm> = new Map();

  constructor(targetName: string, notebooks: INotebookTracker) {
    this.targetName = targetName;
    notebooks.widgetAdded.connect((_: INotebookTracker, np: NotebookPanel) => this.monitorPanel(np));
    notebooks.forEach(this.monitorPanel);
  }

  private readonly monitorPanel = (panel: NotebookPanel) => {
    panel.sessionContext.kernelChanged.connect(this.onKernelChanged);

    if (panel.sessionContext.session !== null) {
      panel.sessionContext.session.kernel.registerCommTarget(this.targetName, this.onCommOpened);
    }
  };

  private readonly onKernelChanged = (_: ISessionContext, {oldValue, newValue}: Session.ISessionConnection.IKernelChangedArgs) => {
    if (oldValue !== null) {
      oldValue.removeCommTarget(this.targetName, this.onCommOpened);
    }

    if (newValue !== null) {
      newValue.registerCommTarget(this.targetName, this.onCommOpened);
    }
  };

  private readonly onCommOpened = (comm: Kernel.IComm, msg: KernelMessage.ICommOpenMsg) => {
    if (msg.content.target_name == this.targetName) {
      this.activeComms.set(comm.commId, comm);
      comm.onMsg = this.onCommMessage;
      comm.onClose = (msg: KernelMessage.ICommCloseMsg) => {
        this.activeComms.delete(comm.commId);
      }
    }
  };

  private readonly onCommMessage = (msg: KernelMessage.ICommMsgMsg) => {
    this.onAnyMessage(msg.content.data);
  }

  // intentionally modifiable -- this is how one signs up for notifications
  public onAnyMessage = (d: JSONObject) => {};

  public broadcastMessage(d: JSONObject) {
    this.activeComms.forEach((comm: Kernel.IComm) => {
      comm.send(d);
    });
  }
}
