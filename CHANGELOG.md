# @wwtelescope/jupyterlab 1.3.2 (2021-10-27)

- Use a yet newer version of `@wwtelescope/research-app-messages` — the previous
  fix was incomplete.


# @wwtelescope/jupyterlab 1.3.1 (2021-10-27)

- Use a newer version of the `@wwtelescope/research-app-messages` dependency to
  solve a bug that caused some URLs to get modified as they pass through the
  messaging system (#10, @pkgw). This made it so that some WWT APIs that
  depended on exact URL matching wouldn't work, notably the loading of imagesets
  by URL.


# @wwtelescope/jupyterlab 1.3.0 (2021-10-23)

- Support custom app URLs that are relative to the Jupyter(Lab) baseUrl (#9,
  @pkgw). The custom URL of `/wwtstatic/research/` will use a local copy of the
  research app installed by (an as-yet-unreleases version of) pywwt.


# @wwtelescope/jupyterlab 1.2.1 (2021-10-23)

No code changes from 1.2.0. The automated Python package publication needs some
work, and we want to keep the version numbers of the two packages precisely in
sync.


# @wwtelescope/jupyterlab 1.2.0 (2021-10-23)

- Add a "prebuilt" version of the extension, available in the Python package
  `wwt_jupyterlab_extension` (#7, @pkgw).
- Make the app URL configurable using JupyterLab's settings framework (#7,
  @pkgw). The setting is `@wwtelescope/jupyterlab:research/appUrl`.
- Improve the package metadata, such as `jupyerlab/discovery` records in
  the `package.json` file (#7, @pkgw).


# @wwtelescope/jupyterlab 1.1.2 (2021-09-21)

- Give the iframe permissions like allowfullscreen, so that the user can
  fullscreen the WWT window (#6, @pkgw).


# @wwtelescope/jupyterlab 1.1.1 (2021-07-29)

The 1.1.0 release accidentally contained a local hack that made it not work at
all. Fix that. (#5, @pkgw)


# @wwtelescope/jupyterlab 1.1.0 (2021-07-23)

- Relay *all* messages, with the appropriate origin, to clients. This is
  essential to allow bidirectional data flow between clients and the app, such
  as our HiPS catalog support in which clients download catalog data from the
  running application.
- Tag messages with `_pywwtExpedite` items to assist pywwt's Jupyter async
  skullduggery, which is needed to get asynchronous user code working in the
  Jupyter environment. If no skullduggery is occurring, then we're just adding a
  random field that no one cares about.
- Check and report availability of the WWT Kernel Data Relay. This is a new
  Jupyter Server extension that we're developing that will assist pywwt (and
  potentially other kernel code) in serving up data to the WWT frontend. The WWT
  JupyterLab extension doesn't *need* to do anything to support the relay, but
  we can help clients easily check whether the relay is available, which isn't
  straightforward on the kernel side.
- Monitor the app's liveness and report it to clients. This is done using
  "ping-pong" messages to see whether the app is responsive. It's helpful to
  centralize this checking in the extension to avoid kernel roundtrips for the
  monitoring.
- Don't start processing messages until the WWT iframe has loaded; should avoid
  a minor race condition.
- Update to bugfixed @wwtelescope/research-app-messages 0.7.1


# @wwtelescope/jupyterlab 1.0.0 (2021-02-09)

Initial release of the AAS WorldWide Telescope JupyterLab extension. This
extension bridges the WWT "research app", its HTML interface aimed at research
uses, and the JupyterLab environment, such that you can open up the research app
in JupyterLab and talk to it through running kernels.

Documentation and more infrastructure to come, but this release should be
functional.
