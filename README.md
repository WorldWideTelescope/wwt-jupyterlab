[![Build Status](https://dev.azure.com/aasworldwidetelescope/WWT/_apis/build/status/WorldWideTelescope.wwt-jupyterlab?branchName=master)](https://dev.azure.com/aasworldwidetelescope/WWT/_build/latest?definitionId=24&branchName=master)
[![Powered by NumFOCUS](https://img.shields.io/badge/powered%20by-NumFOCUS-orange.svg?style=flat&colorA=E1523D&colorB=007D8A)](http://numfocus.org)

# `@wwtelescope/jupyterlab`

[WorldWide Telescope][wwt-home] (WWT) inside [JupyterLab]. Learn more
about WWT [here][wwt-home].

[wwt-home]: https://worldwidetelescope.org/home/
[JupyterLab]: https://jupyterlab.readthedocs.io/


## Requirements

This extension supports:

- The JupyterLab 2.x series
- The JupyterLab 3.x series


## Installation

There are two main ways you can install this extension. Both of them require
that you already have JupyterLab set up.

If you have JupyterLab >= 3.0 installed, you can install this extension in
"prebuilt" mode, by installing its corresponding Python package,
[`wwt_jupyterlab_extension`]. On the command line this might be done with:

[`wwt_jupyterlab_extension`]: https://pypi.org/project/wwt-jupyterlab-extension/

```bash
$ pip install wwt_jupyterlab_extension
```

The prebuilt approach is the one that is generally recommended.
**Alternatively**, you can also install this extension in "source" mode, using
its NPM package [`@wwtelescope/jupyterlab`]. You can do this from JupyterLab
itself, using its [Extension Manager], or from the command line with:

[`@wwtelescope/jupyterlab`]: https://www.npmjs.com/package/@wwtelescope/jupyterlab
[Extension Manager]: https://jupyterlab.readthedocs.io/en/stable/user/extensions.html#managing-extensions-using-the-extension-manager

```bash
$ jupyter labextension install @wwtelescope/jupyterlab
```

There is a `jupyter labextension uninstall` command to remove the extension if
you install it this way. This installation mode requires a "rebuild" of the
JupyterLab app assets, which is somewhat slow and requires the [Node.js] system
to be available on your system.

[Node.js]: https://nodejs.org/

In concert with this extension we recommend that you install:

- The [jupyterlab_widgets] JupyterLab extension
- [pywwt] as a Jupyter [server extension]
- The [wwt_kernel_data_relay] Jupyter server extension

[jupyterlab_widgets]: https://pypi.org/project/jupyterlab-widgets/
[pywwt]: https://pywwt.readthedocs.io/
[server extension]: https://jupyter-notebook.readthedocs.io/en/stable/extending/handlers.html#writing-a-notebook-server-extension
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
$ jupyter labextension install .  # link your development version of the extension with JupyterLab
$ jupyter lab build  # Rebuild JupyterLab after making any changes
$ jlpm watch  # Auto-rebuild sources (long-running)
$ jupyter lab --watch  # Run JupyterLab, auto-reloading changed extensions (long-running)

$ jlpm run build  # build locally
$ jlpm add ${npm_package_name}  # add a dep

$ jupyter labextension build  # build the prebuilt version of the extension
$ cd wwt_jupyterlab_extension && python -m build  # build dists of the prebuild Python module

$ jlpm eslint  # detect and fix ESLint complaints
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
