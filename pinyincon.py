from xpinyin import Pinyin

p = Pinyin()
# cfile = open('out_filt1', 'r')
# outfile = open('out_pinyin', 'w')
# for line in cfile:
# 	outfile.write(p.get_pinyin(line, ''))

cfile = open('meme', 'r')
outfile = open('pinyin_out', 'w')
setto = set()
i = 0
for line in cfile:
	if i % 1000:
		print(i)
	if "展开全文c" not in line:
		setto.add(line)
	i += 1
for line in setto:
	outfile.write(p.get_pinyin(line,''))