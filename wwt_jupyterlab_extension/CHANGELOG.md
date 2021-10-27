# rc: micro bump

- Use a yet newer version of `@wwtelescope/research-app-messages` — the previous
  fix was incomplete.


# wwt_jupyterlab_extension 1.3.1 (2021-10-27)

- Use a newer version of the `@wwtelescope/research-app-messages` dependency to
  solve a bug that caused some URLs to get modified as they pass through the
  messaging system (#10, @pkgw). This made it so that some WWT APIs that
  depended on exact URL matching wouldn't work, notably the loading of imagesets
  by URL.


# wwt_jupyterlab_extension 1.3.0 (2021-10-23)

- Support custom app URLs that are relative to the Jupyter(Lab) baseUrl (#9,
  @pkgw). The custom URL of `/wwtstatic/research/` will use a local copy of the
  research app installed by (an as-yet-unreleases version of) pywwt.


# wwt_jupyterlab_extension 1.2.1 (2021-10-23)

No code changes from 1.2.0. Working out the automatic Python publication
infrastructure.


# wwt_jupyterlab_extension 1.2.0 (2021-10-23)

This package provides the new "prebuilt" version of the [@wwtelescope/jupyterlab]
JupyterLab extension. Compared to the previous release of the extension, changes
are:

[@wwtelescope/jupyterlab]: https://www.npmjs.com/package/@wwtelescope/jupyterlab

- Make the app URL configurable using JupyterLab's settings framework (#7,
  @pkgw). The setting is `@wwtelescope/jupyterlab:research/appUrl`.
- Improve the package metadata, such as `jupyerlab/discovery` records in
  the `package.json` file (#7, @pkgw).
