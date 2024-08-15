const path = './style_transfer_crowd_compute_inputs.csv';
const outputs = [
    {key: 'StyleTunedLM', name: 'StyleTunedLM'},
    {key: 'FEW_SHOT_BASELINE', name: 'FEW SHOT BASELINE'}, 
    {key: 'INSTRUCT_BASELINE', name: 'INSTRUCT BASELINE'},  
];

function renderBucket(bucket) {
    return `
    <div class="original sticky line">
        <div class='source'>PROMPT</div>
        <div>${bucket[0].PROMPT}</div> <!-- Accessing PROMPT directly -->
    </div>
    ${bucket.map(line => renderAuthorAndStyles(line)).join('')}
    `;
}

function renderAuthorAndStyles(line) {
    return `
    <div class="author-set">
        <div class="style sticky line">
            <div class='source'>AUTHOR</div>
            <div>${line.AUTHOR}</div> <!-- Accessing AUTHOR directly -->
        </div>
        <div>${outputs.map(output => renderText(output, line)).join('')}</div>
        <div class="spacer" style="height: 20px;"></div> <!-- Spacer after each author block -->
    </div>
    `;
}

// Add a button to toggle between short and long text
function renderText(output, line) {
    const text = line[output.key];
    const name = output.name;
    if (text) {
        let classes = 'line';
        if (name === 'StyleTunedLM') {
            classes += ' ours'; // Ensuring 'StyleTunedLM' is styled in blue
        }

        const shortText = text.length > 100 ? text.slice(0, 100) + '...' : text; // Show first 100 characters + ellipsis
        const isLongText = text.length > 100;

        return `<div class='${classes}'>
            <div class='source'>${name}</div>
            <div class='output'>
                <span class="short-text">${shortText}</span>
                ${isLongText ? `<span class="long-text" style="display: none;">${text}</span>` : ''}
                ${isLongText ? `<button class="toggle-btn" onclick="toggleText(this)">Read More</button>` : ''}
            </div>
        </div>`;
    }
    return '';
}


function render() {
    d3.csv(path).then(function (res) {
        const textBuckets = {};
        res.forEach(line => {
            const key = line.PROMPT;
            if (!(key in textBuckets)) {
                textBuckets[key] = [];
            }
            textBuckets[key].push(line); // Push all lines with the same PROMPT into the same bucket
        });

        const dom = `${Object.values(textBuckets).map(bucket => renderBucket(bucket)).join('')}`;
        d3.select('.results').html(dom);
    });
}

function toggleText(button) {
    const parent = button.parentElement;
    const shortText = parent.querySelector('.short-text');
    const longText = parent.querySelector('.long-text');

    if (longText.style.display === 'none') {
        shortText.style.display = 'none';
        longText.style.display = 'inline';
        button.textContent = 'Show Less';
    } else {
        shortText.style.display = 'inline';
        longText.style.display = 'none';
        button.textContent = 'Read More';
    }
}

render();
