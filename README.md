# AAS WorldWide Telescope Research Kit

This repository contains the code for the [AAS] [WorldWide Telescope][wwt-home]
(WWT) research user interface, and supporting systems. Learn more about WWT
[here][wwt-home].

[AAS]: https://aas.org/
[wwt-home]: https://worldwidetelescope.org/home/


## Developers’ quick start

1. Check out this repository to a machine with [Node.js] and [npm].
1. `git submodule update --init`
1. `npx lerna bootstrap`
1. `npm run build` creates:

[Node.js]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/get-npm

This repository is a [monorepo] containing the source for several interlocking
TypeScript packages. README files inside the individual subdirectories give more
information about their contents and development workflows. The multi-package
structure of this repository is dealt with using [Lerna].

[monorepo]: https://en.wikipedia.org/wiki/Monorepo
[Lerna]: https://lerna.js.org/

Running NPM command from inside package subdirectories unfortunately *will not*
work due to the centralized `node_modules` directory we use with Lerna. To run
the `lint` command only for the `engine-types` submodule, run:

```
npx lerna run --scope @wwtelescope/engine-types lint
```

(The `--scope` argument can be a glob expression if you want to run on a subset
of packages.)


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
