#! /usr/bin/env python
# Copyright 2021 the .NET Foundation
# Licensed under the MIT License

"""
Setup script for wwt_jupyterlab_extension.

Strongly derived from the `jupyterlab/extension-examples` examples. We're a bit
unusual in that we place the Python package in a subdirectory of the main repo
directory, to keep things a bit more encapsulated.
"""

import io
from pathlib import Path
import sys

import setuptools

HERE = Path(__file__).parent.resolve()
ROOT = HERE.parent

name = "wwt_jupyterlab_extension"  # cranko project-name
lab_path = HERE / name.replace("-", "_") / "labextension"

ensured_targets = [str(lab_path / "package.json"), str(lab_path / "static/style.js")]

labext_name = "@wwtelescope/jupyterlab"

data_files_spec = [
    (
        "share/jupyter/labextensions/%s" % labext_name,
        str(lab_path.relative_to(HERE)),
        "**",
    ),
    ("share/jupyter/labextensions/%s" % labext_name, str("."), "install.json"),
]

long_description = (HERE / "README.md").read_text()


def get_version():
    version_ns = {}
    with io.open(HERE / name.replace("-", "_") / "_version.py", encoding="utf8") as f:
        exec(f.read(), {}, version_ns)
    return version_ns["__version__"]


setup_args = dict(
    name=name,
    version=get_version(),
    url="https://github.com/WorldWideTelescope/wwt-jupyterlab",
    author="The AAS WorldWide Telescope Team",
    author_email="wwt@aas.org",
    description="AAS WorldWide Telescope in JupyterLab",
    license="MIT",
    long_description=long_description,
    long_description_content_type="text/markdown",
    packages=setuptools.find_packages(),
    install_requires=[],
    zip_safe=False,
    include_package_data=True,
    python_requires=">=3.6",
    platforms="Linux, Mac OS X, Windows",
    keywords=["Jupyter", "JupyterLab", "JupyterLab3"],
    classifiers=[
        "License :: OSI Approved :: BSD License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Framework :: Jupyter",
    ],
)

try:
    from jupyter_packaging import wrap_installers, npm_builder, get_data_files

    post_develop = npm_builder(
        build_cmd="install:extension", source_dir=ROOT / "src", build_dir=lab_path
    )
    setup_args["cmdclass"] = wrap_installers(
        post_develop=post_develop, ensured_targets=ensured_targets
    )
    setup_args["data_files"] = get_data_files(data_files_spec)
except ImportError as e:
    import logging

    logging.basicConfig(format="%(levelname)s: %(message)s")
    logging.warning(
        "Build tool `jupyter-packaging` is missing. Install it with pip or conda."
    )
    if not ("--name" in sys.argv or "--version" in sys.argv):
        raise e

if __name__ == "__main__":
    setuptools.setup(**setup_args)
