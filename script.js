function processText() {
    const textInput = document.getElementById('textInput');
    const outputElement = document.getElementById('output');

    const text = textInput.value;
    if (!text) {
        outputElement.textContent = "Please enter some text into the textarea.";
        return;
    }

    const lines = text.split(/\r?\n/);
    const record = [];
    let currentMonth = "";

    function dumpRecord(recordRows) {
        if (recordRows.length > 1) {
            const group = recordRows[1].match(/(\w{3})\s(\d\d?)\s\d{4}/);
            if (group) {
                const month = group[1];
                const day = group[2];
                if (currentMonth !== month) {
                    if (currentMonth) {
                        outputElement.textContent += '\n';
                    }
                    outputElement.textContent += getFullMonthName(month) + '\n';
                    currentMonth = month;
                }
                outputElement.textContent += `${day}\t${recordRows[0]}\n`;
            }
        }
    }

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine && record.length > 0) {
            dumpRecord(record);
            record.length = 0;
        } else if (trimmedLine) {
            record.push(trimmedLine);
        }
    });

    if (record.length > 0) {
        dumpRecord(record);
    }
}

function getFullMonthName(abbreviation) {
    const months = {
        "Jan": "January",
        "Feb": "February",
        "Mar": "March",
        "Apr": "April",
        "May": "May",
        "Jun": "June",
        "Jul": "July",
        "Aug": "August",
        "Sep": "September",
        "Oct": "October",
        "Nov": "November",
        "Dec": "December"
    };

    // Convert the abbreviation to uppercase to ensure case-insensitive matching
    const monthAbbreviation = abbreviation.trim();

    // Check if the abbreviation exists in the months object
    if (months.hasOwnProperty(monthAbbreviation)) {
        return months[monthAbbreviation];
    } else {
        return "Invalid abbreviation";
    }
}


document.getElementById('textInput').addEventListener('input', () => {
    document.getElementById('output').textContent = ''; // Clear output on new input
});
