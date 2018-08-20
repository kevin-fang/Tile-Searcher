import subprocess, sys, numpy as np
from subprocess import CalledProcessError, Popen, PIPE, STDOUT
import clustalo, parseInput
from application import TileApplication, Tile
from copy import deepcopy

# initialize new application
app = TileApplication()

# set up command line arguments
parseInput.setup_parsing(app)

# parse command line arguments
parseInput.parse_input(app)

# ensure that the system has the commands it needs to search
app.test_command_availability()

# set up information needed for tile search
coefPaths = np.load(app.data['hiq_info'])
tile_path = np.trunc(coefPaths / (16 ** 5))
tile_step = np.trunc((coefPaths - tile_path * 16 ** 5) / 2)
tile_phase = np.trunc((coefPaths - tile_path * 16 ** 5 - 2 * tile_step))
vhex = np.vectorize(hex)
vectorized_path = vhex(tile_path.astype('int'))
vectorized_step = vhex(tile_step.astype('int'))
vectorized_phase = vhex(tile_phase.astype('int'))

def tile_search(index):
	vec_path = str(vectorized_path[int(index)])
	vec_path = vec_path[2:].zfill(4)

	try:
		proc = subprocess.check_output("cat " + app.data['assembly_fwi'] + " | grep :" + vec_path, shell=True)
		return proc
	except CalledProcessError as e:
		raise Exception("Assembly index file not found.", str(e))

def fill_tile_info(tile_item):
	index = tile_item.index
	tile = tile_search(index)
	path = vectorized_path[index]
	step = vectorized_step[index]
	phase = vectorized_phase[index]

	filled_tile = Tile(index)
	filled_tile.path = path[2:].zfill(4)
	filled_tile.step = step[2:].zfill(4)
	filled_tile.phase = phase
	filled_tile.tile_str = tile.rstrip()

	return filled_tile

def fill_variants_info(tile_item):
	filled_tile = deepcopy(tile_item)
	filename = "{}/{}.sglf.gz".format(app.data['keep'], tile_item.path)
	try:
		filled_tile.variants = subprocess.check_output('zgrep {}.00.{} {}'.format(tile_item.path, tile_item.step, filename), shell=True)
		return filled_tile
	except CalledProcessError as e:
		raise Exception("Collection not found: {}".format(filename))

def fill_clustalo_entries(tile_item):
	filled_tile = deepcopy(tile_item)
	variants = tile_item.variants.split('\n')[:-1]
	fasta = clustalo.convert_list_to_fasta(variants)
	# clustalo output goes (entries, diffs)
	filled_tile.clustalo_output = clustalo.get_clustalo(fasta)
	return filled_tile

def fill_clustalo_diffs(tile_item):
	filled_tile = deepcopy(tile_item)
	clustal_entries = filled_tile.clustalo_output[1]

	diffs = []
	for j, string in enumerate(clustal_entries):
		spaces = [i + 60 * j + 1 for i, ltr in enumerate(string) if ltr == " "]
		diffs.extend(spaces)

	filled_tile.clustalo_entries = filled_tile.clustalo_output[0]
	filled_tile.clustalo_diffs = diffs
	return filled_tile

def fill_bp_loc(tile_item):
	filled_tile = deepcopy(tile_item)
	split = filled_tile.tile_str.split('\t')
	begin = int(split[2])
	sequence = int(split[1])
	

	cmdToRun = "bgzip -c -b %d -s %d -d %s | grep -B1 \"%s\s\"" % (begin, sequence, app.data['assembly_gz'], filled_tile.step)

	try:
		subprocess.call("bgzip -r " + app.data['assembly_gz'], shell=True)
		output = subprocess.check_output(cmdToRun, shell=True)
		filled_tile.bp_output = output
		return filled_tile
	except CalledProcessError as e:
		raise Exception("assembly file not found.")

# get the location of tiles and store it because it will be important later
if app.functionality['get_location']:
	# fill the tile info for the tile, in case needed later
	app.tiles[0] = fill_tile_info(app.tiles[0])
	print(str(app.tiles[0]).rstrip() + '\n')

if app.functionality['get_base_pair_locations']:
	app.tiles[0] = fill_bp_loc(app.tiles[0])
	print(app.tiles[0].bp_output.rstrip() + '\n')

if app.functionality['print_variant_diffs']:
	# fill the variant info for the file, in case needed later
	app.tiles[0] = fill_variants_info(app.tiles[0])
	app.tiles[0] = fill_clustalo_entries(app.tiles[0])
	app.tiles[0] = fill_clustalo_diffs(app.tiles[0])

	for item in app.tiles[0].clustalo_entries:
		print "\n".join(item)
	
if app.functionality['get_diff_indices']:
	print("Index of variant differences: {}".format(app.tiles[0].clustalo_diffs))