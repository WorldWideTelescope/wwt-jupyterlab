[![Build Status](https://dev.azure.com/aasworldwidetelescope/WWT/_apis/build/status/WorldWideTelescope.wwt-research-kit?branchName=master)](https://dev.azure.com/aasworldwidetelescope/WWT/_build/latest?definitionId=24&branchName=master)

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

The AAS WorldWide Telescope system is a [.NET Foundation] project. Work on WWT
has been supported by the [American Astronomical Society] (AAS), the US
[National Science Foundation] (grants [1550701], [1642446], [2004840]), the [Gordon
and Betty Moore Foundation], and [Microsoft].

[American Astronomical Society]: https://aas.org/
[.NET Foundation]: https://dotnetfoundation.org/
[National Science Foundation]: https://www.nsf.gov/
[1550701]: https://www.nsf.gov/awardsearch/showAward?AWD_ID=1550701
[1642446]: https://www.nsf.gov/awardsearch/showAward?AWD_ID=1642446
[2004840]: https://www.nsf.gov/awardsearch/showAward?AWD_ID=2004840
[Gordon and Betty Moore Foundation]: https://www.moore.org/
[Microsoft]: https://www.microsoft.com/


## Legalities

The WWT code is licensed under the [MIT License]. The copyright to the code is
owned by the [.NET Foundation].

[MIT License]: https://opensource.org/licenses/MIT
