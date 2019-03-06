from bs4 import BeautifulSoup
from urllib2 import urlopen
from time import gmtime, strftime
import csv

html_input = 'https://www.clipperroundtheworld.com/race/standings'
output_file = '/home/john_r_hoopes/clipper/data/clipper-positions-' + strftime("%Y-%m-%d-%Hh%Mm", gmtime()) + '-GMT.csv'


soup = BeautifulSoup(urlopen(html_input), 'html.parser')
table = soup.find('table', {'id': 'currentstandings'})
rows = table.findAll('tr')


with open(output_file, 'wb') as csvfile:
    clipperwriter = csv.writer(csvfile)

    clipperwriter.writerow(['position', 'team', 'lat', 'lon', 'dtf', 'dif', \
        'dist_mg', 'last_report', 'status', 'finish_time'])

    for i, row in enumerate(rows):
        row_array = []
        if i != 0:
            cells = row.findAll('td')
            for i, cell in enumerate(cells):
                raw_val = cell.text.strip()
                if i == 0:
                    val = int(raw_val)
                elif i == 1:
                    if 'Joker Played' in raw_val:
                        val = raw_val.replace('Joker Played', '').strip()
                    else:
                        val = raw_val
                elif i == 2 or i == 3:
                    val = float(cell.text.strip())
                elif i == 6:
                    val = int(raw_val[:-2])
                elif i == 5:
			print raw_val[:-2]# = float(raw_val[:-2])
		else:
                    val = cell.text.strip()
                row_array.append(val)
            clipperwriter.writerow(row_array)


