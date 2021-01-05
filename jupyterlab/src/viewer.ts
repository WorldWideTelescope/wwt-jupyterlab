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

export class WWTLabViewer extends Widget {
  constructor(targetName: string) {
    super();

    this.iframe = document.createElement('iframe');
    this.iframe.src = '//web.wwtassets.org/research/latest/';  // XXX
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

  _onKernelsChanged(_: KernelManager, models: Kernel.IModel[]) {
    models.forEach(model => {
      if (!this.kernelConnections.has(model.id)) {
        this._connectToKernel(model);
      }
    });
  }

  _connectToKernel(model: Kernel.IModel) {
    const conn = this.kernelManager.connectTo({model: model});
    this.kernelConnections.set(model.id, conn);

    conn.registerCommTarget(this.targetName, (comm, msg) => {
      if (msg.content.target_name !== this.targetName) {
        return;
      }

      comm.onMsg = this._onCommMessage.bind(this);
      //comm.onClose = this._onCommClose.bind(this);
      comm.send({});
    });
  }

  _onCommMessage(msg: KernelMessage.ICommMsgMsg) {
    console.log("comm msg");
    console.log(msg);

    const window = this.iframe.contentWindow;
    if (window) {
      if ((window as any).wwt) {
        (window as any).wwt_apply_json_message((window as any).wwt, msg.content.data);
      }
    }
  }
}
