[![Build Status](https://dev.azure.com/aasworldwidetelescope/WWT/_apis/build/status/WorldWideTelescope.wwt-jupyterlab?branchName=master)](https://dev.azure.com/aasworldwidetelescope/WWT/_build/latest?definitionId=24&branchName=master)
[![Powered by NumFOCUS](https://img.shields.io/badge/powered%20by-NumFOCUS-orange.svg?style=flat&colorA=E1523D&colorB=007D8A)](http://numfocus.org)

# `@wwtelescope/jupyterlab`

[WorldWide Telescope][wwt-home] (WWT) inside [JupyterLab]. Learn more
about WWT [here][wwt-home].

[wwt-home]: https://worldwidetelescope.org/home/
[JupyterLab]: https://jupyterlab.readthedocs.io/


## Requirements

This extension supports:

- The JupyterLab 4.x series

Older releases support the 2.x and 3.x series of JupyterLab.


## Installation

To install this extension, you must first install JupyterLab. Currently this
extensions only supports the JupyterLab 4.x version series.

Next, install this extension’s Python package, [`wwt_jupyterlab_extension`]. On
the command line this might be done with:

[`wwt_jupyterlab_extension`]: https://pypi.org/project/wwt-jupyterlab-extension/

```bash
$ pip install wwt_jupyterlab_extension
```

This is known as a “prebuilt” extension installation is strongly preferred in
current versions of JupyterLab.

In concert with this extension we recommend that you install:

- The [jupyterlab_widgets] JupyterLab extension
- [pywwt] as a Jupyter [server extension]
- The [wwt_kernel_data_relay] Jupyter server extension

[jupyterlab_widgets]: https://pypi.org/project/jupyterlab-widgets/
[pywwt]: https://pywwt.readthedocs.io/
[server extension]: https://jupyter-server.readthedocs.io/en/stable/developers/extensions.html
[wwt_kernel_data_relay]: https://wwt-kernel-data-relay.readthedocs.io/


## Configuration

The extension has one configuration setting, `appUrl`, that specifies the URL to
use for loading the [WWT research app][rapp]. The default value is the latest
web-hosted version of the app, found at
`https://web.wwtassets.org/research/latest/`. It might be useful to override
this for local development or to force the use of a local app (required by some
servers for security reasons).

[rapp]: https://docs.worldwidetelescope.org/research-app/latest/

Users can change extension settings in the JupyterLab “Advanced Settings
Editor”, accessible through the “Settings” menu. To change this setting in a
system-wide fashion, create a file named
`$JUPYTER_DATA_DIR/lab/settings/overrides.json` with contents of the following
form:

```json
{
  "@wwtelescope/jupyterlab:research": {
    "appUrl": "/wwtstatic/research/"
  }
}
```

Here, `$JUPYTER_DATA_DIR` can be obtained by running the command `jupyter
--data-dir`, and the customized lab URL is `/wwtstatic/research/`, which will
use a locally bundled version of the app if you've installed the latest version
of [pywwt] as a Jupyter server extension.


## Development

Since this repo contains a JupyterLab extension, the primary build interface is
using the [jlpm] command, which is JupyterLab’s bundled version of [yarn].

[jlpm]: https://jupyterlab.readthedocs.io/en/stable/extension/extension_tutorial.html
[yarn]: https://yarnpkg.com/

Some useful commands are as follows:

```bash
$ jlpm run build  # compile TS -> JS
$ jupyter labextension build  # create wwt_jupyterlab_extension/wwt_jupyterlab_extension/labextension
$ cd wwt_jupyterlab_extension && python -m build  # create dists of the Python package

$ jlpm add ${npm_package_name}  # add a dep
$ jlpm eslint  # detect *and fix* ESLint complaints

$ jlpm watch  # Auto-rebuild sources (long-running)
$ jupyter lab --watch  # Run JupyterLab, auto-reloading changed extensions (long-running)
```


## Continuous Integration and Deployment

This repository uses [Cranko] to automate release workflows. This automation is
essential to the smooth and reproducible deployment of the WWT web services.

[Cranko]: https://pkgw.github.io/cranko/


## Getting involved

We love it when people get involved in the WWT community! You can get started
by [participating in our user forum] or by
[signing up for our low-traffic newsletter]. If you would like to help make
WWT better, our [Contributor Hub] aims to be your one-stop shop for
information about how to contribute to the project, with the
[Contributors’ Guide] being the first thing you should read. Here on GitHub we
operate with a standard [fork-and-pull] model.

[participating in our user forum]: https://wwt-forum.org/
[signing up for our low-traffic newsletter]: https://bit.ly/wwt-signup
[Contributor Hub]: https://worldwidetelescope.github.io/
[Contributors’ Guide]: https://worldwidetelescope.github.io/contributing/
[fork-and-pull]: https://help.github.com/en/articles/about-collaborative-development-models

All participation in WWT communities is conditioned on your adherence to the
[WWT Code of Conduct], which basically says that you should not be a jerk.

[WWT Code of Conduct]: https://worldwidetelescope.github.io/code-of-conduct/


## Acknowledgments

Work on the WorldWide Telescope system has been supported by the [American
Astronomical Society] (AAS), the [.NET Foundation], and other partners. See [the
WWT user website][acks] for details.

[American Astronomical Society]: https://aas.org/
[.NET Foundation]: https://dotnetfoundation.org/
[acks]: https://worldwidetelescope.org/about/acknowledgments/


## Legalities

The WWT code is licensed under the [MIT License]. The copyright to the code is
owned by the [.NET Foundation].

[MIT License]: https://opensource.org/licenses/MIT
