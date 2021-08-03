chrome.omnibox.setDefaultSuggestion({
    description: 'Enter a hex code of 6 characters to convert to RGB (for example, <match>ffffff</match>)'
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    //check that the length of the text is 6 characters
    if (text.length !== 6) {
        suggest([]);
        return;
    }

    //send text to API
    fetch('http://www.colourlovers.com/api/color/' + text + '?format=json')
    .then((response) => response.json())
    .then((data) => {
        if (!data.length) {
            //no color was found
            suggest([]);
        } else {
            suggest([
                {
                    content: `${data[0].rgb.red}, ${data[0].rgb.green}, ${data[0].rgb.blue} url: ${data[0].url}`,
                    deletable: true,
                    description: `
                        Color name: ${data[0].title}, hex: <match>${data[0].hex}</match>, more information: <url>${data[0].url}</url>
                    `
                }
            ])
        }
    })
});

chrome.omnibox.onInputEntered.addListener((text, OnInputEnteredDisposition) => {
    const prefixIndex = text.indexOf('url: ');
    if (prefixIndex !== -1) {
        const url = text.substring(prefixIndex + 'url: '.length)
        console.log(url);
        if (OnInputEnteredDisposition === 'currentTab') {
            chrome.tabs.create({url});
        } else {
            chrome.tabs.update({url});
        }
    }
})