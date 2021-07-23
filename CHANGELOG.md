# rc: minor bump

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
