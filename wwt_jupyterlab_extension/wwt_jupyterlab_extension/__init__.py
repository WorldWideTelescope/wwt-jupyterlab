# Copyright 2021-2023 the .NET Foundation
# Licensed under the MIT License

from ._version import __version__

def _jupyter_labextension_paths():
    return [{
        'src': 'labextension',
        'dest': '@wwtelescope/jupyterlab',
    }]
