# `@wwtelescope/jupyterlab`

[AAS] [WorldWide Telescope][wwt-home] (WWT) inside [JupyterLab]. Learn more
about WWT [here][wwt-home].

[AAS]: https://aas.org/
[wwt-home]: https://worldwidetelescope.org/home/
[JupyterLab]: https://jupyterlab.readthedocs.io/


## Requirements

This extension supports:

- The JupyterLab 2.x series
- The JupyterLab 3.x series


## Installation

In principle, all you need to do is:

```bash
$ jupyter labextension install @wwtelescope/jupyterlab
```

There is a `jupyter labextension uninstall` command to remove the extension.


## Development

Some useful commands are as follows:

```bash
$ jupyter labextension install .  # link your development version of the extension with JupyterLab
$ jupyter lab build  # Rebuild JupyterLab after making any changes
$ jlpm watch  # Auto-rebuild sources (long-running)
$ jupyter lab --watch  # Run JupyterLab, auto-reloading changed extensions (long-running)
```
