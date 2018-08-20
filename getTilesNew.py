import subprocess, sys, numpy as np
from subprocess import CalledProcessError, Popen, PIPE, STDOUT
import clustalo, parseInput
from application import Application

app = Application()
parseInput.setup_parsing(app)
parseInput.parse_input(app)
app.test_command_availability()

# set up information needed for tile search
coefPaths = np.load(app.data['hiq_info'])
tile_path = np.trunc(coefPaths / (16 ** 5))
tile_step = np.trunc((coefPaths - tile_path * 16 ** 5) / 2)
tile_phase = np.trunc((coefPaths - tile_path * 16 ** 5 - 2 * tile_step))
vhex = np.vectorize(hex)
vectorizedPath = vhex(tile_path.astype('int'))
vectorizedStep = vhex(tile_step.astype('int'))
vectorizedPhase = vhex(tile_phase.astype('int'))