function parsePageContext(text) {
  var bodyDOM = new DOMParser().parseFromString(text, 'text/html');
  var urlParts = document.URL.split('/');
  var backlinkName = urlParts[urlParts.length - 2];
  var backlinkElement = bodyDOM.getElementsByName(backlinkName)[0];
  return backlinkElement.parentElement;
}

function parsePageContent(text) {
  var bodyDOM = new DOMParser().parseFromString(text, 'text/html');
  const contentElement = bodyDOM.querySelector('div.e-content');

  if (contentElement) {
    const elementCount = contentElement.childElementCount < 3 ? contentElement.childElementCount : 3;
    const contentSlice = Array.from(contentElement.children).slice(0, elementCount);

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

function appendLinkPopup(link) {
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
      const contentElements = parsePageContent(text);
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
const internalLinks = document.querySelectorAll('a.internal');

internalLinks.forEach((link) => {
  appendLinkPopup(link);
});

// retrieves content from all backlinks that reference this page
const sourceLinks = document.querySelectorAll('a.backlink');

sourceLinks.forEach((link) => {
  appendSourceContent(link);
});