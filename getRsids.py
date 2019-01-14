#!/usr/bin/env python
import getTileVariants
import application
import subprocess
import argparse
from extractor import describe_dna
import yaml
import sys

CONFIG_FILENAME = "config.yml"


# load reference vcf from config
with open(CONFIG_FILENAME, 'r') as stream:
    data_args = yaml.load(stream)
    ref_vcf = data_args['ref_vcf']

# import afterwards, because the process of importing takes a long time
# and arguments should be parsed beforehand

# mutation class, created for simpler use


class Mutation:
    def __init__(
            self,
            start,
            change,
            mutation_type,
            chrom,
            stop=-1,
            pre_offsetted=False):
        self.start = int(start)
        self.stop = int(stop)
        self.change = change
        self.mutation_type = mutation_type
        self.offsetted = pre_offsetted
        self.chrom = chrom

    # adds a specified offset to start and stop
    def offset(self, offset_val):
        if not self.offsetted:
            self.start = self.start + int(offset_val) - 24
            if self.stop != -1:
                self.stop = self.stop + int(offset_val) - 24
            else:
                self.stop = self.start + 1
            self.offsetted = True
        else:
            print("Already offsetted")

    # queries for the possible rsids of the mutation using bcftoolsj
    def rsid_query(self):
        if self.offsetted:
            query_str = "{}:{}-{}".format(self.chrom, self.start, self.stop)
            #bcfstr = 'bcftools query -f' + '\'chr%CHROM %ID %POS %REF>%ALT\\n\'' + ' -r ' + query_str + ' ' + ref_vcf
            #resultquery = subprocess.check_output(bcfstr,shell=True)
            proc = subprocess.Popen(["bcftools",
                                     "query",
                                     "-f",
                                     r"%CHROM %ID %POS %REF %ALT\n",
                                     "-r",
                                     query_str,
                                     ref_vcf],
                                    stdout=subprocess.PIPE,
                                    stderr=subprocess.STDOUT)
            return proc.communicate()[0][:-1].split('\n')
        else:
            print("Mutation not yet offsetted. Please offset before querying.")
            return None

    def __repr__(self):
        return "{}_{}{}{}".format(
            self.start,
            self.stop,
            self.mutation_type,
            self.change)

    def __str__(self):
        return "Start: {}, Stop: {}, Change: {}, Mutation type: {}".format(
            self.start, self.stop, self.change.upper(), self.mutation_type)


# create a mutation object from the description extractor information


def get_mutation(mutation_string, info_tile):
    mutation_symbols = ['subst', 'delins', 'del', 'ins', 'dup', 'inv']
    for mutation in mutation_symbols:
        if mutation in mutation_string:
            info = mutation_string.split(mutation)
            # calculate start and stop
            if len(info[0].split("_")) == 2:
                start, stop = info[0].split("_")
            else:
                start = info[0]
                stop = -1

            if mutation == "del":
                info[1] = common_seq[int(start):int(stop)]
            return Mutation(
                start=start,
                stop=stop,
                change=info[1],
                mutation_type=mutation,
                chrom=info_tile.to_dict()['chrom'])

    else:  # it would be a substitution (SNP)
        # substitutions always follow the format #W>W. Break up into number
        # then SNP content
        num, mutation = mutation_string[:-3], mutation_string[-3:]

        return Mutation(
            start=num,
            change=mutation,
            mutation_type="subst",
            chrom=info_tile.to_dict()['chrom'])


def rsid_search(tile_index, variant, suppress_output=True):
    results_dict = {}

    tile = application.Tile(tile_index)
    varval = int(variant)
    # retrieve tile information using getTileVariants script
    info_tile = getTileVariants.tile_iteration(
        tile, suppress_output=True, all_functionality=True)

    # break up output into common variant (.000) and specifically chosen
    # variant
    tile_variant = info_tile.variants.split('\n')[varval]
    common_variant = info_tile.variants.split('\n')[0]

    if tile_variant == common_variant:
        print("No difference between tiles. Exiting...")
        sys.exit()

    # retrieve sequence, ignoring hash + id
    tile_seq = tile_variant.split(',')[2]
    common_seq = common_variant.split(',')[2]

    results_dict['tile_sequence'] = tile_variant
    results_dict['common_sequence'] = common_variant
    results_dict['variant'] = variant
    results_dict['index'] = tile_index
    results_dict['mutations'] = {}

    if not suppress_output:
        print("Common sequence: {}".format(common_seq))
        print("Variant sequence: {}".format(tile_seq))
    # delete spanning tile parts if necessary
    if len(tile_seq) - len(common_seq) >= 24:
        tile_seq = tile_seq[:len(common_seq)]
        if not suppress_output:
            print("Detected spanning tile. Deleting extra part...")
    elif len(common_seq) - len(tile_seq) >= 24:
        common_seq = common_seq[:len(tile_seq)]
        if not suppress_output:
            print("Detected spanning tile. Deleting extra part...")

    # run mutalyzer description extractor for alignment data
    allele = describe_dna(common_seq, tile_seq)
    changes = str(allele)

    # break up into list if needed
    changes = changes.replace('[', '')
    changes = changes.replace(']', '')
    changes = changes.split(';')

    mutations = map(lambda x: get_mutation(x, info_tile), changes)

    # offset all mutations
    map(lambda x: x.offset(info_tile.to_dict()['position_start']), mutations)

    # store all the queries
    rsid_queries = map(lambda x: x.rsid_query(), mutations)

    rsid_queries = list(filter(lambda x: x != '', rsid_queries))

    mutations_lst = zip(mutations, rsid_queries)

    # print results
    for mutation, rsid_lst in mutations_lst:
        if not suppress_output:
            print('---')
            print("Mutation: {}".format(mutation))
            print("Representation: {}".format(repr(mutation)))

        mutation_info = []

        if len(rsid_lst) > 0 and rsid_lst[0] != '':
            if not suppress_output:
                print("Possible SNP RSIDS:")
            for rsid_query in rsid_lst:
                chrom, rsid, location, ref, alt = rsid_query.split(" ")
                result_str = "RSID: {}; Location: {}, REF: {}, ALT: {}".format(
                    rsid, location, ref, alt)

                if not suppress_output:
                    print(result_str)
                mutation_info.append((rsid, location, ref, alt))
        else:
            if not suppress_output:
                print("No possible SNPs found")

        results_dict['mutations'][repr(mutation)] = mutation_info

    return results_dict


if __name__ == "__main__":
    # set up argument parsing
    parser = argparse.ArgumentParser(
        description="Retrieve a list of possible RSIDs a tile variant may contain")

    parser.add_argument(
        "-i",
        "--index",
        type=int,
        help="Index of tile to search",
        required=True)
    parser.add_argument(
        "-v",
        "--variant",
        type=int,
        help="Which variant to search for RSIDs for (e.g. for varval 1, it will use the variant with id ending in .001)")
    args = parser.parse_args()
    rsid_search(args.index, args.variant, suppress_output=False)
