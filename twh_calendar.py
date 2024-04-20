import os
import re


def main(calendar_file):
    record = []
    dumper = make_dumper()
    with open(calendar_file, "r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if not line and record:
                dumper(record)
                record = []
            elif line:
                record.append(line)
            else:
                dumper(record)
                record = []
    if record:
        dumper(record)


def make_dumper():
    def dump_record(record_rows):
        if not hasattr(dump_record, 'current_month'):
            dump_record.current_month = ""
        match = re.search(r"\((\w{3}) (\d\d?) \d\d\d\d",
                          record_rows[1])
        if match:
            month = match.group(1)
            day = match.group(2)
            if not dump_record.current_month or \
                   dump_record.current_month != month:
                if dump_record.current_month:
                    print()
                print(month)
                dump_record.current_month = month
            print(f"{record_rows[0]}\t{day}")
    return dump_record

if __name__ == "__main__":
    main("calendar.txt")
