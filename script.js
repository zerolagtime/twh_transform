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
            const group = recordRows[1].match(/(\w{3})\s(\d\d?)\s\d{4} (\d\d?):(\d\d)(AM|PM)/);
            if (group) {
                const month = group[1];
                const day = group[2];
                const hour = group[3];
                const minutes = group[4];
                const ampm = group[5].toLowerCase()
                var displayTime = `${hour}${ampm}`
                if (minutes != "00") {
                    var displayTime = `${hour}:${minutes}${ampm}`
                }
                if (currentMonth !== month) {
                    // if (currentMonth) {
                    //     // Create a new line break element
                    //     const lineBreak = document.createElement('br');
                    //     outputElement.appendChild(lineBreak);
                    // }
                    // Create a new paragraph element for the month name
                    const monthName = getFullMonthName(month);
                    const monthParagraph = document.createElement('div');
                    monthParagraph.setAttribute('class', 'record-month');
                    monthParagraph.textContent = monthName;
                    outputElement.appendChild(monthParagraph);
                    currentMonth = month;
                }
                // Create a new paragraph element for the day and event
                const eventParagraph = document.createElement('span');
                eventParagraph.setAttribute('class', 'record-event');
                const daySpan1 = document.createElement('span');
                daySpan1.setAttribute('class', 'record-event-day');
                daySpan1.textContent = day;
                eventParagraph.appendChild(daySpan1);
                const tabSpan = document.createElement('span');
                tabSpan.innerHTML = "&emsp;";
                eventParagraph.appendChild(tabSpan);
                const daySpan2 = document.createElement('span');
                daySpan2.setAttribute('class', 'record-event-name');
                daySpan2.textContent = recordRows[0];
                eventParagraph.appendChild(daySpan2);
                eventParagraph.innerHTML += "&nbsp;";
                const timeSpan = document.createElement('span');
                timeSpan.textContent = ` - ${displayTime}`;
                eventParagraph.appendChild(timeSpan);
                const blankSpan = document.createElement('span');
                blankSpan.setAttribute('class','record-event-name-filler');
                eventParagraph.appendChild(blankSpan);
                const eventBreak = document.createElement('br');
                eventParagraph.appendChild(eventBreak);
                // eventParagraph.textContent = `${day}\t${recordRows[0]}`;
                outputElement.appendChild(eventParagraph);
            }
        }
    }
    
    // Example usage:
    const outputBox = document.getElementById('output_box');
    // Call dumpRecord function with appropriate recordRows argument
    
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

document.addEventListener('DOMContentLoaded', function () {
    const copyButton = document.getElementById('copy-button');
    const outputBox = document.getElementById('output');

    copyButton.addEventListener('click', function () {
        if (!navigator.clipboard) {
            fallbackCopyText(outputBox);
        } else {
            navigator.clipboard.writeText(outputBox.innerText)
                .then(() => {
                    showOverlay(); // Show overlay on success
                })
                .catch(err => console.error('Error in copying text: ', err));
        }
    });

    function fallbackCopyText(element) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showOverlay(); // Show overlay on success
            }
            console.log('Fallback: Copying text command was ' + (successful ? 'successful' : 'unsuccessful'));
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        selection.removeAllRanges();
    }

    function showOverlay() {
        const previous_content = copyButton.textContent
        copyButton.textContent = "Text Copied"
        setTimeout(() => {
            copyButton.textContent = previous_content;
        }, 2000); // Hide overlay after 2 seconds
    }
});



document.getElementById('textInput').addEventListener('input', () => {
    document.getElementById('output').textContent = ''; // Clear output on new input
});
