function parsePageContext(text) {
    var bodyDOM = new DOMParser().parseFromString(text, 'text/html');
    var urlParts = document.URL.split('/');
    var backlinkName = urlParts[urlParts.length - 2];
    var backlinkElement = bodyDOM.getElementsByName(backlinkName)[0];
    return backlinkElement.parentElement;
}

function parsePageContent(text, elementTypes) {
    var bodyDOM = new DOMParser().parseFromString(text, 'text/html');
    const contentElement = bodyDOM.querySelector('.e-content');

    if (contentElement) {
        const paragraphElements = Array.from(contentElement.children).filter((el) => elementTypes.includes(el.localName));
        const elementCount = paragraphElements.length < 3 ? paragraphElements.length : 3;
        const contentSlice = Array.from(paragraphElements).slice(0, elementCount);

        if (elementCount < contentElement.childElementCount) {
            const ellipsisElement = document.createElement('p');
            ellipsisElement.innerText = '...';
            contentSlice.push(ellipsisElement);
        }
        return contentSlice;

    } else {
        const missing = document.createElement('p');
        missing.text = 'no content found';
        return [missing];
    }
}

function createPopup(offsetTop, offsetLeft, contentElements) {
    const popup = document.createElement('div');

    popup.classList.add('backlink-popup', 'hide');
    popup.style.top = `${offsetTop + 20}px`;
    popup.style.left = `${offsetLeft}px`;
    contentElements.forEach((el) => popup.appendChild(el));

    return popup;
}

function appendLinkPopup(link, elementTypes) {
    fetch(link.href)
        .then((resp) => {
            if (resp.status === 200) {
                return resp.text();
            } else {
                return null;
            }
        })
        .then((text) => {
            if (text === null) { return null; }
            const contentElements = parsePageContent(text, elementTypes);
            const popupElement = createPopup(link.offsetTop, link.offsetLeft, contentElements);
            link.appendChild(popupElement);
        });
}

function appendSourceContent(link) {
    fetch(link.href)
        .then((resp) => {
            if (resp.status === 200) {
                return resp.text();
            } else {
                return null;
            }
        })
        .then((text) => {
            if (text === null) { return null; }
            const contextElement = parsePageContext(text);
            const wrapper = document.createElement('p');
            wrapper.appendChild(contextElement);
            link.parentElement.appendChild(wrapper);
        });
}

// adds backlink popup as a hidden child element to all links marked internal
// if the viewport is wider than a cell phone
const widerThanPhone = window.matchMedia("screen and (min-width:40.063em)").matches;

if (widerThanPhone) {
    const internalLinks = document.querySelectorAll('a.internal');

    internalLinks.forEach((link) => {
        const popupElementTypes = [
            'h1', 'h2', 'h3', 'h4', // headers
            'p', // paragraphs
            'ol', 'ul', 'li' // lists
        ];
        appendLinkPopup(link, popupElementTypes);
    });
}

// retrieves content from all backlinks that reference this page
const sourceLinks = document.querySelectorAll('a.backlink');

sourceLinks.forEach((link) => {
    appendSourceContent(link);
});