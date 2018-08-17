from subprocess import Popen, PIPE, STDOUT
import os

genomes_raw = """0288.00.0415.000+1,1db2677afc28b28828c3054d87fe76eb,ttgttcttcatggctctctgtgtctgatccaagaggcgaggccagtttcatttgagcattaaatgtcaagttctgcacgctatcatcatcaggggccgaggcttctctttgtttttaattaattgtttttaactgtgagtttatatacacttgaagcagtatacatttagaaatggtctacttgtcgtttctttgattactacccatgagacagtattagtaattctggcctatgaaattggcaaagaa
0288.00.0415.001+1,8b9ec6ba1f92704ce2a1e9ea48a5e7ac,ttgttcttcatggctctctgtgtctgatccaagaggcgaggccagtttcatttgagcattaagtgtcaagttctgcacgctatcatcatcaggggccgaggcttctctttgtttttaattaattgtttttaactgtgagtttatatacacttgaagcagtatacatttagaaatggtctacttgtcgtttctttgattactacccatgagacagtattagtaattctggcctatgaaattggcaaagaa
0288.00.0415.002+1,aef8b22206d0d4990d241df5ba77569e,ttgttcttcatggctctctgtgtctgatccaagaggcgaggccagtttcatttgagcattaaatgtcaagttctgcacgctatcatcatcaggggccgaggcttctctttgtttttaattaattgtttttaactgtgagtttatatacacttgaagcagtatacatttagaaatggtatacttgtcgtttctttgattactacccatgagacagtattagtaattctggcctatgaaattggcaaagaa
0288.00.0415.003+1,7f256b514ed48a866817b176873d9c1c,ttgttcttcatggctctctgtgtctgatccaagaggcgaggccagtttcatttgagcattaagtgtcaagttctgcacgctatcatcatcaggggccgaggcttctctttgtttttaattaattgtttttaactgtgagtttatatacacttgaagcagtatacatttagaaatggtatacttgtcgtttctttgattactacccatgagacagtattagtaattctggcctatgaaattggcaaagaa
0288.00.0415.004+1,f93f2543c4008ae74975924fcaeb9ea5,ttgttcttcatggctctctgtgtctgatccaagaggcgaggccagtttcatttgagcattaaatgtcaagttctgcacgctgtcatcatcaggggccgaggcttctctttgtttttaattaattgtttttaactgtgagtttatatacacttgaagcagtatacatttagaaatggtctacttgtcgtttctttgattactacccatgagacagtattagtaattctggcctatgaaattggcaaagaa
0288.00.0415.005+1,c8fb0f6fd3fb02b5a3b93bd7e1590079,ttgttcttcatggctctctgtgtctgatccaagaggcgaggccagtttcatttgagcattaagtgtcaagttctgcacgctatcatcatcaggggccgaggcttctctttgtttttaattaattgtttttaactgtgggtttatatacacttgaagcagtatacatttagaaatggtatacttgtcgtttctttgattactacccatgagacagtattagtaattctggcctatgaaattggcaaagaa"""

input_genomes = genomes_raw.split('\n')

fasta = ""
for genome in input_genomes:
	chunks = genome.split(',')
	fasta += ">{},{}\n{}\n".format(*chunks)
fasta = fasta[:-1]

input_filename = "fasta"
output_filename = "aligned.tmp"

with open(input_filename, 'w') as f:
	f.write(fasta)

proc = Popen(['clustalo', "-infile={}".format(input_filename), "-outfile={}".format(output_filename)], stdout=PIPE, stderr=STDOUT)

stdout = proc.communicate()

os.remove(input_filename)
os.remove(input_filename + '.dnd')

aligned = ""
with open(output_filename, 'r') as f:
	aligned = f.read()

os.remove(output_filename)

print(aligned)