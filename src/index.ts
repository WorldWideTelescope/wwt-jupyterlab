import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import {
  ICommandPalette,
  MainAreaWidget,
  WidgetTracker,
} from '@jupyterlab/apputils';

import { PageConfig } from '@jupyterlab/coreutils';

import { ILauncher } from '@jupyterlab/launcher';

import { INotebookTracker } from '@jupyterlab/notebook';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { LabIcon } from '@jupyterlab/ui-components';

import { WWTLabCommManager } from './comms';
import { WWTLabViewer } from './viewer';
import WWT_ICON from '../style/icons/wwt.svg';

const RESEARCH_PLUGIN_ID = '@wwtelescope/jupyterlab:research';
const CATEGORY = 'WorldWide Telescope';
const OPEN_COMMAND = 'wwtelescope:open';

const wwtIcon = new LabIcon({
  name: RESEARCH_PLUGIN_ID + ':wwt',
  svgstr: WWT_ICON,
});

class WWTLabExtensionState {
  constructor(
    app: JupyterFrontEnd,
    restorer: ILayoutRestorer,
    notebooks: INotebookTracker,
    settings: ISettingRegistry
  ) {
    this.app = app;

    // Set up to track and restore widget state. Of course we're not correctly
    // persisting the internal engine state.

    this.tracker = new WidgetTracker<MainAreaWidget<WWTLabViewer>>({
      namespace: RESEARCH_PLUGIN_ID,
    });
    restorer.restore(this.tracker, {
      command: OPEN_COMMAND,
      name: () => RESEARCH_PLUGIN_ID,
    });

    this.commMgr = new WWTLabCommManager(RESEARCH_PLUGIN_ID, notebooks);

    // Set up to track settings.

    settings.load(RESEARCH_PLUGIN_ID).then((s) => {
      this.onSettingsUpdate(s);
      s.changed.connect(this.onSettingsUpdate);
    });

    // Check whether the WWT Kernel Data Relay server extension is installed.
    // We'll pass this information to kernels so that they can give the user
    // guidance about what features are available.

    const url = this.maybeApplyBaseUrl('/wwtkdr/_probe');

    fetch(url).then((response: Response) => {
      this.commMgr.dataRelayConfirmedAvailable = response.ok;
    });
  }

  private app: JupyterFrontEnd;
  private tracker: WidgetTracker;
  private commMgr: WWTLabCommManager;
  private widget: MainAreaWidget<WWTLabViewer> | null = null;
  private appUrl = 'https://web.wwtassets.org/research/latest/'; // sync with schema/*.json

  onOpenNewViewer(): void {
    if (this.widget === null) {
      const content = new WWTLabViewer(this.commMgr, this.appUrl);

      this.widget = new MainAreaWidget({ content });
      this.widget.id = RESEARCH_PLUGIN_ID + ':wwt';
      this.widget.title.label = 'WorldWide Telescope';
      this.widget.title.icon = wwtIcon;
      this.widget.title.closable = true;
      this.widget.disposed.connect(() => {
        this.widget = null;
      });
    }

    if (!this.tracker.has(this.widget)) {
      this.tracker.add(this.widget);
    }

    if (!this.widget.isAttached) {
      this.app.shell.add(this.widget, 'main');
    }

    this.app.shell.activateById(this.widget.id);
  }

  private readonly onSettingsUpdate = (
    settings: ISettingRegistry.ISettings
  ): void => {
    this.appUrl = this.maybeApplyBaseUrl(
      settings.get('appUrl').composite as string
    );
    // If there is an active widget, in principle we could have a way to tell it
    // to reload its iframe, but that would be annoying to implement and doesn't
    // enable any realistic user wins that I can see -- just close and reopen
    // the app pane.
  };

  private readonly maybeApplyBaseUrl = (url: string): string => {
    if (url.slice(0, 4) === '/wwt') {
      const baseUrl = PageConfig.getBaseUrl();

      if (baseUrl.slice(-1) === '/') {
        url = baseUrl.slice(0, -1) + url;
      } else {
        url = baseUrl + url;
      }
    }

    return url;
  };
}

function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  launcher: ILauncher,
  restorer: ILayoutRestorer,
  notebooks: INotebookTracker,
  settings: ISettingRegistry
): void {
  const state = new WWTLabExtensionState(app, restorer, notebooks, settings);

  app.commands.addCommand(OPEN_COMMAND, {
    label: (args) =>
      args['isPalette']
        ? 'Open WorldWide Telescope Viewer'
        : 'WorldWide Telescope',
    caption: 'Open the WorldWide Telescope viewer',
    icon: wwtIcon,
    iconClass: (args) => (args['isPalette'] ? '' : 'jp-TerminalIcon'),
    execute: state.onOpenNewViewer.bind(state),
  });

  palette.addItem({ command: OPEN_COMMAND, category: CATEGORY });

  launcher.add({
    command: OPEN_COMMAND,
    category: 'Other',
    rank: 1,
  });
}

/**
 * Initialization data for the extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: RESEARCH_PLUGIN_ID,
  autoStart: true,
  requires: [
    ICommandPalette,
    ILauncher,
    ILayoutRestorer,
    INotebookTracker,
    ISettingRegistry,
  ],
  activate: activate,
};

export default extension;
