# Tile Searcher
### Kevin Fang, 2017-19
Python scripts that allow for information to be extracted from tiles.

Contains a script (`getTileVariants.py`) that retrieves tile information, including step, path, phase, and variants from assembly files that and can also perform Clustal Omega alignments on the variants.

Contains another script (`getRsids.py`) to retrieve RSIDs for specific variants. 

A Dockerfile is also provided for easy dependency installation. To call it, run `./runInDocker.sh "<command line arguments here>"`. For example, `./runInDocker.sh "./getTileVariants -i 1234"`. If the docker build is not named kfang/tile-tools, then change the docker image name in the shell script.

To get up and running, set the Arvados API keys and download your assembly files. The included `./setup.sh` file downloads GRCh37 assembly files and high quality naming info for the Harvard PGP. Then, modify `config.yml` to reflect where the data is located. A sample configuration file is provided. Note that for `getTileVariants.py`, you can choose which config arguments to include depending on search requirements. However, `getRsids.py` uses every feature of `getTileVariants.py`, so it _requires_ that the all the files requirements are specified in `config.yml`.


## Tile Variant Searching

The script `getTileVariants.py` is used to retrieve tile information, including step, path, phase, and variants from assembly files. Also contains a multiple sequence aligner to compare with all the variants (using Clustal Omega alignment).

Note that to run the ClustalW alignment at the end to check for variant differences, you must have the [Clustal Omega](http://www.clustal.org/omega/) package installed and have `clustalo` added to your path.

Deprecated: ability to use command line arguments (too cluttered). Instead, call `python getTileVariants.py -i 1234 67890` after setting `config.yml`.

## RSID Searching

The script `getRsids.py` is used to retrieve a list of possible RSIDs for SNPs/INDELS located in a variant of a genome. It compares a variant with the most common tile, and uses Mutalyzer 2 to locate the variations. 

A sample call to check for possible RSIDs on the first variant of tile 1234 would look like `./getRsids.py -i 1234 -v 1`. Note that to call `getRsids.py`, `config.yml` _must_ be set.


## Tile Searching as a function

If you would like to use the output of the tile searching script in Python, you do not need to manually parse the output. `getTileVariants.py` is available as a function, callable from python. See the example below:  
```python
# import modules for tile variant searching
import getTileVariants, application

# search for index 1234
tile = application.Tile(1234)
tile_info = getTileVariants.tile_iteration(tile, out="suppress")
# options for output: "suppress" prevents anything from being printed, out=print will print output.

info_dict = tile_info.to_dict()

'''
info_dict looks like this:
{
    "chrom": "9",
    "path": "01c4",
    "position_end": "136140011",
    "position_start": "136139786",
    "step": "0369"
}
'''
```

There is more tile information available in the `tile_info` object that is returned. See below:   
```python
class Tile:
    def __init__(self, index):
        ...

        # tile path, step, and phase 
        self.path = None
        self.phase = None
        self.step = None

        # string representation of tile
        self.tile_str = None

        # tile variants
        self.variants = None

        # raw output from clustalo
        self.clustalo_output = None

        # calculated diffs from clustalo
        self.clustalo_diffs = None
        
        # raw text output from base pair location searching
        self.bp_output = None       

        # mapping from tile indexes to chromosomal locations
        self.diffs_map = None
```

## RSID Searching as a function

To use the RSID Searching from inside python, simply import it as a module. 

```python
# import module
import getRsids
# search for RSIDs for tile with index 1234, 1st variant.
# returns a dictionary with tile (variant) sequence, common sequence, variant, mutations, and index
info_dict = getRsids.rsid_search(1234, 1)

'''
info_dict looks like this:
{  
   "tile_sequence":"0000.00.0269.001+1,478d344b887e4dd7ed5d4af3c9cd8a76,atgccgctgcggggcacgttggtcctttccgcactcggggtccccggcggcctcacgcgtccgtgcagcggaggcttcctgagccccctggagagcctggcctgggcccgggtgtggagaccctcccgggctttcaatccgggcaggaggcagatggcagacaaaaaaaaaacataagagaaccgaattaggtgggtggcctgggtggacaaaagccttcttgacgccgggtggtcccaaaggcttctg",
   "variant":1,
   "mutations":{  
      "936633_936644delinsaaaaaaaaaaca":[  
         ("rs1017325702", "936636", "G", "C"),
         ("rs887210492",  "936643", "C", "A")
      ]
   },
   "common_sequence":"0000.00.0269.000+1,86945238e5aa7ad4ff4b407a3c442c46,atgccgctgcggggcacgttggtcctttccgcactcggggtccccggcggcctcacgcgtccgtgcagcggaggcttcctgagccccctggagagcctggcctgggcccgggtgtggagaccctcccgggctttcaatccgggcaggaggcagatggcagactcagcagtcacgtaagagaaccgaattaggtgggtggcctgggtggacaaaagccttcttgacgccgggtggtcccaaaggcttctg",
   "index":1234
}
'''
```
